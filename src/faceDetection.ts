import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

const WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.3/wasm';
const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

let detector: Promise<FaceLandmarker> | undefined;

function loadDetector() {
  detector ??= FilesetResolver.forVisionTasks(WASM_URL)
    .then(files => FaceLandmarker.createFromOptions(files, {
      baseOptions: { modelAssetPath: MODEL_URL },
      runningMode: 'IMAGE',
      numFaces: 2,
    }))
    .catch(error => {
      detector = undefined;
      throw error;
    });

  return detector;
}

export async function detectFaces(selfie: HTMLCanvasElement) {
  const faceLandmarker = await loadDetector();
  return faceLandmarker.detect(selfie).faceLandmarks;
}
