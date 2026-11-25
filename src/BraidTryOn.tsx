import { useEffect, useId, useRef, useState, type ChangeEvent } from 'react';
import { ImagePlus, Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Service } from './data';
import { EXAMPLE_SELFIE, getTryOnReference, MAX_SELFIE_BYTES, MAX_SELFIE_SIDE, TRY_ON_PATH } from './tryOnCatalog';
import './braidTryOn.css';

const MAX_UPLOAD_SIZE = 15 * 1024 * 1024;
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const API_ENDPOINT = import.meta.env.VITE_PROVADOR_API_URL?.trim() || TRY_ON_PATH;
const messages: Readonly<Partial<Record<string, string>>> = {
  quota: 'As simulações gratuitas de hoje acabaram. Tente novamente após a renovação da cota.',
  rate_limit: 'Você fez várias tentativas seguidas. Aguarde um minuto e tente novamente.',
  busy: 'O provador está cheio agora. Tente novamente em instantes.',
  invalid_photo: 'Use uma foto com a cabeça e os ombros no quadro, em formato vertical ou quadrado.',
};

class PreviewError extends Error {}

function useObjectUrl(blob: Blob | undefined) {
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    const next = blob && URL.createObjectURL(blob);
    setUrl(next);
    return () => { if (next) URL.revokeObjectURL(next); };
  }, [blob]);

  return url;
}

async function prepareSelfie(url: string) {
  const image = new Image();
  image.src = url;
  try {
    await image.decode();
  } catch {
    throw new PreviewError('Não foi possível abrir a foto. Experimente outro arquivo JPG, PNG ou WebP.');
  }

  const { naturalWidth: width, naturalHeight: height } = image;
  if (Math.min(width, height) / Math.max(width, height) < 0.5) {
    throw new PreviewError(messages.invalid_photo);
  }

  const scale = Math.min(1, MAX_SELFIE_SIDE / Math.max(width, height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const context = canvas.getContext('2d', { alpha: false });
  if (!context) throw new PreviewError('Este navegador não conseguiu preparar a foto.');
  context.fillStyle = '#fff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const photo = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.88));
  if (!photo || photo.size > MAX_SELFIE_BYTES) {
    throw new PreviewError('Não foi possível reduzir a foto. Experimente outro arquivo.');
  }
  return photo;
}

function TryOnContent({ item, example }: { item: Service; example?: string }) {
  const [availability, setAvailability] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const [selfie, setSelfie] = useState<File>();
  const [result, setResult] = useState<Blob>();
  const [showOriginal, setShowOriginal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const pending = useRef<AbortController | null>(null);
  const selfieUrl = useObjectUrl(selfie);
  const resultUrl = useObjectUrl(result);

  useEffect(() => () => pending.current?.abort(), []);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setAvailability('unavailable');
      controller.abort();
    }, 4_000);

    void (async () => {
      try {
        const response = await fetch(API_ENDPOINT, { signal: controller.signal, cache: 'no-store' });
        const status = response.ok ? await response.json() : null;
        if (!controller.signal.aborted) {
          setAvailability(status?.service === 'baxter-braids-provador' && status.available === true ? 'available' : 'unavailable');
        }
      } catch {
        if (!controller.signal.aborted) setAvailability('unavailable');
      } finally {
        window.clearTimeout(timer);
      }
    })();

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, []);

  function choosePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file) return;

    setSelfie(undefined);
    setResult(undefined);
    setShowOriginal(false);
    setError('');
    if (!IMAGE_TYPES.includes(file.type) || file.size > MAX_UPLOAD_SIZE) {
      setError('Escolha uma foto JPG, PNG ou WebP de até 15 MB.');
      return;
    }
    setSelfie(file);
  }

  async function generate() {
    if (availability !== 'available' || !selfieUrl || pending.current) return;
    const controller = new AbortController();
    pending.current = controller;
    setBusy(true);
    setError('');

    let timedOut = false;
    const timer = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 45_000);

    try {
      const photo = await prepareSelfie(selfieUrl);
      const endpoint = new URL(API_ENDPOINT, window.location.origin);
      endpoint.searchParams.set('style', item.id);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'image/jpeg' },
        body: photo,
        signal: controller.signal,
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const message = typeof data?.error === 'string' && Object.hasOwn(messages, data.error)
          ? messages[data.error]
          : undefined;
        throw new PreviewError(message ?? 'Não foi possível gerar a simulação agora. Tente novamente em instantes.');
      }
      if (!IMAGE_TYPES.includes(response.headers.get('Content-Type') ?? '')) {
        throw new PreviewError('O provador está indisponível agora.');
      }
      setResult(await response.blob());
      setShowOriginal(false);
    } catch (problem) {
      if (timedOut) {
        setError('A simulação demorou mais do que o esperado. Tente novamente em instantes.');
      } else if (!controller.signal.aborted) {
        setError(problem instanceof PreviewError ? problem.message : 'Falha na conexão. Tente novamente.');
      }
    } finally {
      window.clearTimeout(timer);
      pending.current = null;
      if (!controller.signal.aborted || timedOut) setBusy(false);
    }
  }

  const demo = availability === 'unavailable' ? example : undefined;
  const comparisonOriginal = demo ? EXAMPLE_SELFIE : selfieUrl;
  const comparisonResult = demo ?? resultUrl;
  const displayingResult = Boolean(comparisonResult && !showOriginal);
  const displayUrl = displayingResult ? comparisonResult : comparisonOriginal;
  const imageAlt = demo
    ? displayingResult ? `Exemplo de simulação de ${item.name}` : 'Selfie de exemplo original'
    : displayingResult ? `Simulação de ${item.name} na sua foto` : 'Sua selfie original';

  return (
    <div className="try-on-content">
      <p className="try-on-style">{item.name}</p>
      {availability === 'available' && (
        <>
          <p>Escolha uma selfie com a cabeça e os ombros no quadro. Ao gerar a simulação, a foto será enviada à Cloudflare para processamento.</p>
          <label className="button outline try-on-upload" aria-disabled={busy}>
            <ImagePlus size={18} aria-hidden="true" />
            {selfie ? 'Trocar foto' : 'Escolher selfie'}
            <input type="file" accept={IMAGE_TYPES.join(',')} disabled={busy} onChange={choosePhoto} />
          </label>
        </>
      )}
      {availability === 'unavailable' && (
        <p>{demo ? 'Demonstração com uma selfie de exemplo. A geração com sua foto está indisponível agora.' : 'A geração com sua foto está indisponível agora.'}</p>
      )}
      {displayUrl && (
        <figure className="try-on-preview">
          <img src={displayUrl} alt={imageAlt} />
          <figcaption>{displayingResult ? 'Simulação por IA. O resultado real pode variar.' : 'Foto original'}</figcaption>
        </figure>
      )}
      {selfieUrl && !result && (
        <button className="button full" type="button" disabled={busy} onClick={generate}>
          <Sparkles size={18} aria-hidden="true" /> Gerar simulação grátis
        </button>
      )}
      <div role="status">{availability === 'checking' ? 'Verificando disponibilidade…' : busy ? 'Gerando a simulação…' : result ? 'Simulação pronta.' : ''}</div>
      {error && <p className="try-on-error" role="alert">{error}</p>}
      {comparisonResult && (
        <button className="button outline try-on-original" type="button" aria-pressed={showOriginal} onClick={() => setShowOriginal(current => !current)}>
          Ver foto original
        </button>
      )}
      <Link className={`button full ${result ? '' : 'outline'}`} to={`/agendar/${item.id}`}>Agendar este modelo</Link>
    </div>
  );
}

export function BraidTryOn({ item }: { item: Service }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const reference = getTryOnReference(item.id);
  if (!reference) return null;

  return (
    <>
      <button className="button outline full try-on-trigger" type="button" onClick={() => {
        dialogRef.current?.showModal();
        setOpen(true);
      }}>
        <Sparkles size={18} aria-hidden="true" /> Experimentar na minha foto
      </button>
      <dialog className="try-on-dialog" ref={dialogRef} aria-labelledby={titleId} onClose={() => setOpen(false)}>
        <div className="try-on-heading">
          <h2 id={titleId}>Provador de tranças</h2>
          <button className="round" type="button" aria-label="Fechar provador" onClick={() => dialogRef.current?.close()}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        {open && <TryOnContent item={item} example={reference.example} />}
      </dialog>
    </>
  );
}
