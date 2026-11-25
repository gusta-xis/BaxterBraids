import type { Service } from './data';

export const TRY_ON_PATH = '/api/provador';
export const MAX_SELFIE_SIDE = 511;
export const MAX_SELFIE_BYTES = 256 * 1024;
export const TRY_ON_REFERENCE_DIRECTORY = '/assets/provador-referencias';

const styleDetails = new Map([
  ['estilo-3', 'Match the curved scalp braids and long dark extensions. Follow the reference for the direction, thickness, and spacing of the rows.'],
  ['estilo-6', 'Match the center part, neat braid placement close to the scalp, and the two thick dark braid tails in the reference.'],
  ['estilo-7', 'Match the actual braiding pattern, length, and loose curls visible in the hairstyle reference.'],
]);

export function getTryOnReference(style: Service) {
  return {
    photo: `${TRY_ON_REFERENCE_DIRECTORY}/${style.id}.jpg`,
    details: styleDetails.get(style.id)
      ?? 'Follow the reference for the braid pattern, parting, thickness, length, color, and texture.',
  };
}
