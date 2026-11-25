import { getTryOnReference, MAX_SELFIE_BYTES, MAX_SELFIE_SIDE, TRY_ON_PATH } from '../src/tryOnCatalog';

const MODEL = '@cf/black-forest-labs/flux-2-klein-4b';
const MAX_ENCODED_RESULT = 3 * 1024 * 1024;
const privateHeaders = { 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' };

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  AI: { run(model: string, input: { multipart: { body: ReadableStream<Uint8Array>; contentType: string } }): Promise<unknown> };
  TRY_ON_RATE_LIMIT: { limit(options: { key: string }): Promise<{ success: boolean }> };
}

function fail(status: number, error: string, headers: Record<string, string> = {}) {
  return Response.json({ error }, { status, headers: { ...privateHeaders, ...headers } });
}

async function readUpload(body: ReadableStream<Uint8Array>) {
  const reader = body.getReader();
  const bytes = new Uint8Array(MAX_SELFIE_BYTES);
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) return bytes.subarray(0, size);
      if (size + value.length > bytes.length) {
        await reader.cancel();
        return null;
      }
      bytes.set(value, size);
      size += value.length;
    }
  } finally {
    reader.releaseLock();
  }
}

function jpegDimensions(bytes: Uint8Array) {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  for (let offset = 2; offset + 4 <= bytes.length;) {
    if (bytes[offset++] !== 0xff) return;
    while (bytes[offset] === 0xff) offset++;
    if (offset + 3 > bytes.length) return;
    const marker = bytes[offset++];
    if (marker === 0xda || marker === 0xd9) return;

    const length = view.getUint16(offset);
    if (length < 2 || offset + length > bytes.length) return;
    // SOF0, SOF1 e SOF2 cobrem os JPEGs comuns gerados pelos navegadores.
    if (marker >= 0xc0 && marker <= 0xc2 && length >= 8) {
      return { width: view.getUint16(offset + 5), height: view.getUint16(offset + 3) };
    }
    offset += length;
  }
}

function outputSize(size: number) {
  return Math.max(256, Math.round(size / 16) * 16);
}

function generatedImage(result: unknown) {
  if (!result || typeof result !== 'object' || !('image' in result)) return;
  const encoded = result.image;
  if (typeof encoded !== 'string' || encoded.length > MAX_ENCODED_RESULT) return;

  const binary = atob(encoded);
  const mime = binary.startsWith('\x89PNG\r\n\x1a\n') ? 'image/png'
    : binary.startsWith('\xff\xd8\xff') ? 'image/jpeg'
    : binary.startsWith('RIFF') && binary.slice(8, 12) === 'WEBP' ? 'image/webp'
    : undefined;
  if (!mime) return;

  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Response(bytes, { headers: { ...privateHeaders, 'Content-Type': mime } });
}

function providerFailure(error: unknown) {
  const code = error && typeof error === 'object' && 'code' in error ? error.code : undefined;
  const message = error instanceof Error ? error.message : String(error);

  if (String(code) === '3036' || /\b3036\b|daily free allocation|account limited/i.test(message)) {
    const seconds = Math.ceil((86_400_000 - Date.now() % 86_400_000) / 1000);
    return fail(429, 'quota', { 'Retry-After': String(seconds) });
  }
  if (String(code) === '3040' || /\b3040\b|capacity temporarily exceeded|rate limit/i.test(message)) {
    return fail(503, 'busy');
  }
  return fail(502, 'generation_failed');
}

async function tryOn(request: Request, url: URL, env: Env) {
  if (request.method !== 'POST') return fail(405, 'method_not_allowed', { Allow: 'POST' });
  const origin = request.headers.get('Origin');
  if (origin && origin !== url.origin) return fail(403, 'forbidden');

  const reference = getTryOnReference(url.searchParams.get('style') ?? '');
  if (!reference) return fail(400, 'invalid_style');
  if (request.headers.get('Content-Type') !== 'image/jpeg' || !request.body) return fail(415, 'invalid_photo');
  if (Number(request.headers.get('Content-Length')) > MAX_SELFIE_BYTES) return fail(413, 'invalid_photo');

  const ip = request.headers.get('CF-Connecting-IP') ?? 'local';
  const limit = await env.TRY_ON_RATE_LIMIT.limit({ key: ip });
  if (!limit.success) return fail(429, 'rate_limit', { 'Retry-After': '60' });

  const selfie = await readUpload(request.body);
  if (!selfie) return fail(413, 'invalid_photo');
  const dimensions = jpegDimensions(selfie);
  if (!dimensions) return fail(400, 'invalid_photo');
  const { width, height } = dimensions;
  if (!width || !height || Math.max(width, height) > MAX_SELFIE_SIDE || Math.min(width, height) < Math.max(width, height) / 2) {
    return fail(400, 'invalid_photo');
  }

  const catalogPhoto = await env.ASSETS.fetch(new Request(new URL(reference.photo, url)));
  if (!catalogPhoto.ok || catalogPhoto.headers.get('Content-Type') !== 'image/jpeg') {
    return fail(503, 'reference_unavailable');
  }

  const form = new FormData();
  const outputScale = 512 / Math.max(width, height);
  form.append('input_image_0', new Blob([selfie], { type: 'image/jpeg' }), 'selfie.jpg');
  form.append('input_image_1', await catalogPhoto.blob(), 'referencia.jpg');
  form.append('width', String(outputSize(width * outputScale)));
  form.append('height', String(outputSize(height * outputScale)));
  form.append('prompt', [
    'Edit the first input image, the original selfie. The second input image is a hairstyle reference.',
    'Replace only the original hair with the braids from the reference.',
    reference.details,
    'Fit the braids to the pose and angle of the head. The hair falls naturally around the neck and over the shoulders with matching light and shadows.',
    'Preserve the face, expression, skin tone, accessories, body proportions, pose, clothes, background and framing of the first photo.',
  ].join(' '));

  const multipart = new Response(form);
  try {
    const result = await env.AI.run(MODEL, {
      multipart: { body: multipart.body!, contentType: multipart.headers.get('Content-Type')! },
    });
    return generatedImage(result) ?? fail(502, 'generation_failed');
  } catch (error) {
    return providerFailure(error);
  }
}

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    if (url.pathname !== TRY_ON_PATH) return env.ASSETS.fetch(request);
    try {
      return await tryOn(request, url, env);
    } catch {
      return fail(503, 'unavailable');
    }
  },
};
