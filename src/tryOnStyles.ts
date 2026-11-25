import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

export type TryOnStyle = {
  mask: string;
  anchor: [number, number];
  faceWidth: number;
  heightRatio: number;
};

// Os três recortes usam as coordenadas das fotos correspondentes (378 × 504).
export const tryOnStyles: Readonly<Partial<Record<string, TryOnStyle>>> = {
  'estilo-3': {
    mask: `M 111 211 C 107 197 114 174 115 157 Q 123 97 155 82 Q 184 63 238 77
      Q 279 79 289 126 Q 298 152 290 200 Q 287 227 294 264 C 300 316 309 381 294 431
      Q 283 469 255 484 Q 232 472 242 440 C 248 407 249 355 251 307 Q 259 266 270 229
      Q 278 210 278 194 Q 263 187 253 184 Q 205 180 163 192 Q 143 203 137 221
      Q 134 238 139 260 Q 146 281 138 312 Q 131 370 121 434 Q 112 472 105 489
      Q 96 483 94 467 Q 96 439 86 413 Q 74 371 82 333 Q 90 291 103 261 Q 114 230 111 211 Z`,
    anchor: [205, 188],
    faceWidth: 152,
    heightRatio: 0.72,
  },
  'estilo-6': {
    mask: `M 63 190 Q 56 169 73 156 Q 84 149 98 150 Q 127 111 192 103 Q 220 98 245 102
      Q 270 90 292 109 Q 307 126 313 154 Q 313 177 323 199 L 329 231 Q 326 252 314 259
      Q 310 241 300 235 Q 277 241 261 235 Q 246 235 239 245 Q 217 244 198 252
      Q 182 254 169 271 Q 161 285 147 283 L 139 268 Q 124 280 117 300 Q 108 300 103 275
      Q 93 271 88 281 Q 78 276 78 263 Q 68 241 68 217 Z
      M 87 328 Q 104 333 114 351 Q 114 369 122 388 Q 112 415 117 449 Q 124 485 122 504
      L 89 504 Q 96 479 89 463 Q 78 438 86 421 Q 78 404 84 378 Q 85 352 87 328 Z
      M 323 371 Q 334 375 349 398 Q 365 424 378 437 L 378 504 L 350 504
      Q 349 476 339 451 Q 327 428 317 409 Q 313 395 323 371 Z`,
    anchor: [206, 249],
    faceWidth: 222,
    heightRatio: 0.74,
  },
  'estilo-7': {
    mask: `M 98 249 Q 102 230 114 207 Q 123 185 129 157 Q 134 132 154 117 Q 178 97 217 100
      Q 252 98 262 123 Q 272 138 273 171 Q 278 196 278 226 Q 275 253 273 275
      Q 272 292 277 313 Q 273 342 282 363 Q 280 397 284 424 Q 282 467 293 504 L 164 504
      Q 160 487 167 469 Q 151 449 175 425 Q 161 416 173 392 Q 177 377 178 352
      Q 178 329 186 310 Q 187 301 196 290 Q 218 298 235 282 Q 251 260 257 238
      Q 265 216 264 193 Q 251 174 229 177 Q 210 176 192 194 Q 185 202 173 201
      Q 162 196 153 187 Q 148 173 140 175 Q 132 174 133 206 Q 139 221 136 229 Q 128 246 117 247 Z`,
    anchor: [207, 184],
    faceWidth: 123,
    heightRatio: 0.82,
  },
};

export type FacePlacement = { x: number; y: number; width: number; rotation: number };
export type TryOnAdjustment = { x: number; y: number; size: number };
export const defaultAdjustment: TryOnAdjustment = { x: 0, y: 0, size: 100 };

export function placeOnFace(landmarks: NormalizedLandmark[], width: number, height: number): FacePlacement {
  const forehead = landmarks[10];
  const left = landmarks[234];
  const right = landmarks[454];
  const dx = (right.x - left.x) * width;
  const dy = (right.y - left.y) * height;

  return {
    x: forehead.x * width,
    y: forehead.y * height,
    width: Math.hypot(dx, dy),
    rotation: Math.atan2(dy, dx),
  };
}

export function makeHairLayer(photo: HTMLImageElement, style: TryOnStyle) {
  const layer = document.createElement('canvas');
  layer.width = photo.naturalWidth;
  layer.height = photo.naturalHeight;
  const context = layer.getContext('2d');
  if (!context) throw new Error('Canvas indisponível.');

  context.clip(new Path2D(style.mask));
  context.drawImage(photo, 0, 0);
  return layer;
}

export function drawTryOn(
  canvas: HTMLCanvasElement,
  selfie: HTMLCanvasElement,
  hair: HTMLCanvasElement,
  style: TryOnStyle,
  placement: FacePlacement,
  adjustment: TryOnAdjustment,
  showOriginal: boolean,
) {
  canvas.width = selfie.width;
  canvas.height = selfie.height;
  const context = canvas.getContext('2d');
  if (!context) return;

  context.drawImage(selfie, 0, 0);
  if (showOriginal) return;

  const scale = (placement.width / style.faceWidth) * (adjustment.size / 100);
  context.translate(
    placement.x + placement.width * adjustment.x / 100,
    placement.y + placement.width * adjustment.y / 100,
  );
  context.rotate(placement.rotation);
  context.scale(scale, scale * style.heightRatio);
  context.drawImage(hair, -style.anchor[0], -style.anchor[1]);
}
