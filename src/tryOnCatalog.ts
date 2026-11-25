export const TRY_ON_PATH = '/api/provador';
export const MAX_SELFIE_SIDE = 511;
export const MAX_SELFIE_BYTES = 256 * 1024;
export const EXAMPLE_SELFIE = '/assets/provador-exemplo-selfie.webp';

type StyleReference = { photo: string; details: string; example?: string };

const references = new Map<string, StyleReference>([
  ['estilo-3', {
    photo: '/assets/catalog-04.jpg',
    details: 'Match the curved scalp braids and long dark extensions. Follow the reference for the direction, thickness, and spacing of the rows.',
    example: '/assets/provador-exemplo-boxeadora.webp',
  }],
  ['estilo-6', {
    photo: '/assets/catalog-07.jpg',
    details: 'Match the center part, neat braid placement close to the scalp, and the two thick dark braid tails in the reference.',
    example: '/assets/provador-exemplo-nago.webp',
  }],
  ['estilo-7', {
    photo: '/assets/catalog-08.jpg',
    details: 'Match the actual braiding pattern, length, and loose curls visible in the hairstyle reference.',
  }],
]);

export function getTryOnReference(id: string) {
  return references.get(id);
}
