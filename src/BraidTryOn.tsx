import { useEffect, useId, useRef, useState, type ChangeEvent } from 'react';
import { ImagePlus, Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Service } from './data';
import {
  defaultAdjustment, drawTryOn, makeHairLayer, placeOnFace, tryOnStyles,
  type FacePlacement, type TryOnAdjustment, type TryOnStyle,
} from './tryOnStyles';
import './braidTryOn.css';

const MAX_FILE_SIZE = 15 * 1024 * 1024;
const MAX_IMAGE_SIDE = 1280;
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const adjustments = [
  { key: 'x', label: 'Posição horizontal', min: -35, max: 35 },
  { key: 'y', label: 'Posição vertical', min: -35, max: 35 },
  { key: 'size', label: 'Tamanho', min: 70, max: 135 },
] as const;

type Preview = {
  selfie: HTMLCanvasElement;
  hair: HTMLCanvasElement;
  placement: FacePlacement;
};

class TryOnError extends Error {}

async function loadImage(src: string) {
  const image = new Image();
  image.src = src;
  await image.decode();
  return image;
}

async function readSelfie(file: File) {
  const url = URL.createObjectURL(file);
  try {
    const image = await loadImage(url);
    const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error();
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas;
  } catch {
    throw new TryOnError('Não foi possível abrir a foto. Escolha outro arquivo JPG, PNG ou WebP.');
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function locateFaces(selfie: HTMLCanvasElement) {
  try {
    const { detectFaces } = await import('./faceDetection');
    return await detectFaces(selfie);
  } catch {
    throw new TryOnError('O detector facial ficou indisponível. Confira a conexão ou tente em outro navegador.');
  }
}

function TryOnContent({ item, style }: { item: Service; style: TryOnStyle }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [preview, setPreview] = useState<Preview>();
  const [adjustment, setAdjustment] = useState(defaultAdjustment);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [showOriginal, setShowOriginal] = useState(false);

  useEffect(() => {
    if (preview && canvasRef.current) {
      drawTryOn(canvasRef.current, preview.selfie, preview.hair, style, preview.placement, adjustment, showOriginal);
    }
  }, [preview, style, adjustment, showOriginal]);

  async function choosePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file) return;

    setError('');
    if (!IMAGE_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE) {
      setError('Escolha uma foto JPG, PNG ou WebP de até 15 MB.');
      return;
    }

    setBusy(true);
    try {
      const selfie = await readSelfie(file);
      const faces = await locateFaces(selfie);

      if (faces.length === 0) {
        throw new TryOnError('Nenhum rosto detectado. Tente uma selfie de frente, com boa luz e a cabeça inteira no quadro.');
      }
      if (faces.length > 1) {
        throw new TryOnError('Encontramos mais de um rosto. Escolha uma foto em que você apareça sem companhia.');
      }

      const photo = await loadImage(item.image);
      const hair = makeHairLayer(photo, style);
      const placement = placeOnFace(faces[0], selfie.width, selfie.height);
      setPreview({ selfie, hair, placement });
      setAdjustment(defaultAdjustment);
      setShowOriginal(false);
    } catch (problem) {
      setError(problem instanceof TryOnError ? problem.message : 'Não foi possível montar a prévia. Tente novamente.');
    } finally {
      setBusy(false);
    }
  }

  function adjust(key: keyof TryOnAdjustment, value: number) {
    setAdjustment(current => ({ ...current, [key]: value }));
  }

  return (
    <div className="try-on-content">
      <p className="try-on-style">{item.name}</p>
      <p>Use uma foto de frente, com a cabeça inteira no quadro e o cabelo preso. A foto fica no seu aparelho.</p>
      <label className="button outline try-on-upload" aria-disabled={busy}>
        <ImagePlus size={18} aria-hidden="true" />
        {preview ? 'Trocar foto' : 'Escolher selfie'}
        <input type="file" accept={IMAGE_TYPES.join(',')} disabled={busy} onChange={choosePhoto} />
      </label>
      <div role="status">{busy ? 'Detectando o rosto e preparando a prévia…' : ''}</div>
      {error && <p className="try-on-error" role="alert">{error}</p>}
      {preview && (
        <>
          <figure className="try-on-preview">
            <canvas ref={canvasRef} role="img" aria-label={showOriginal ? 'Sua foto original' : `Sua foto com a prévia de ${item.name}`} />
            <figcaption>{showOriginal ? 'Foto original' : 'Simulação aproximada'}</figcaption>
          </figure>
          <button className="button outline try-on-original" type="button" aria-pressed={showOriginal} onClick={() => setShowOriginal(current => !current)}>
            Ver foto original
          </button>
          <fieldset className="try-on-adjustments" disabled={showOriginal}>
            <legend>Ajustar encaixe</legend>
            {adjustments.map(({ key, label, min, max }) => (
              <label key={key}>
                {label}
                <input type="range" min={min} max={max} value={adjustment[key]} onChange={event => adjust(key, event.currentTarget.valueAsNumber)} />
              </label>
            ))}
            <button type="button" className="try-on-reset" onClick={() => setAdjustment(defaultAdjustment)}>Restaurar ajuste</button>
          </fieldset>
          <Link className="button full" to={`/agendar/${item.id}`}>Agendar este modelo</Link>
        </>
      )}
    </div>
  );
}

export function BraidTryOn({ item }: { item: Service }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const style = tryOnStyles[item.id];
  if (!style) return null;

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
        {open && <TryOnContent item={item} style={style} />}
      </dialog>
    </>
  );
}
