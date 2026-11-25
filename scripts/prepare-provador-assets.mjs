import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { services } from '../src/data.ts';
import { getTryOnReference, MAX_SELFIE_SIDE, TRY_ON_REFERENCE_DIRECTORY } from '../src/tryOnCatalog.ts';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = process.argv.includes('--site') ? 'dist' : '.wrangler/provador-assets';
await mkdir(join(root, output, TRY_ON_REFERENCE_DIRECTORY), { recursive: true });

for (const style of services) {
  const { photo } = getTryOnReference(style);
  await sharp(join(root, 'public', style.image))
    .autoOrient()
    .resize(MAX_SELFIE_SIDE, MAX_SELFIE_SIDE, { fit: 'inside', withoutEnlargement: true })
    .flatten({ background: '#fff' })
    .jpeg({ quality: 88 })
    .toFile(join(root, output, photo));
}

console.log(`Referências do provador preparadas: ${services.length} modelos.`);
