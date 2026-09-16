import type { DetectedFace, Point } from './types';

const LANDMARK_GROUP = [33, 133, 362, 263, 1, 61, 291, 13, 14, 78, 308, 234, 454];
const MOUTH_GROUP = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308];

function point(point: Point, width: number, height: number) {
  return { x: point.x * width, y: point.y * height };
}

function drawCornerBox(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, active: boolean) {
  const color = active ? '#e7fb54' : 'rgba(255,255,255,.35)';
  const length = Math.min(24, Math.max(12, width * .12));
  ctx.strokeStyle = color;
  ctx.lineWidth = active ? 1.5 : 1;
  ctx.beginPath();
  ctx.moveTo(x, y + length); ctx.lineTo(x, y); ctx.lineTo(x + length, y);
  ctx.moveTo(x + width - length, y); ctx.lineTo(x + width, y); ctx.lineTo(x + width, y + length);
  ctx.moveTo(x, y + height - length); ctx.lineTo(x, y + height); ctx.lineTo(x + length, y + height);
  ctx.moveTo(x + width - length, y + height); ctx.lineTo(x + width, y + height); ctx.lineTo(x + width, y + height - length);
  ctx.stroke();
}

export function drawDetectionOverlay(canvas: HTMLCanvasElement, faces: DetectedFace[], primaryIndex: number, smoothBounds: DetectedFace['bounds'] | null, score: number) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.font = `${Math.max(9, width / 120)}px Arial`;
  ctx.textBaseline = 'bottom';

  faces.forEach((face, index) => {
    const isPrimary = index === primaryIndex;
    const bounds = isPrimary && smoothBounds ? smoothBounds : face.bounds;
    const x = bounds.x * width;
    const y = bounds.y * height;
    const boxWidth = bounds.width * width;
    const boxHeight = bounds.height * height;
    drawCornerBox(ctx, x, y, boxWidth, boxHeight, isPrimary);

    ctx.fillStyle = isPrimary ? '#e7fb54' : 'rgba(255,255,255,.52)';
    LANDMARK_GROUP.forEach((index) => {
      const landmark = face.landmarks[index];
      if (!landmark) return;
      const p = point(landmark, width, height);
      ctx.beginPath(); ctx.arc(p.x, p.y, isPrimary ? 2.1 : 1.35, 0, Math.PI * 2); ctx.fill();
    });
    if (isPrimary) {
      ctx.strokeStyle = 'rgba(231,251,84,.78)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      MOUTH_GROUP.forEach((index, pointIndex) => {
        const landmark = face.landmarks[index];
        if (!landmark) return;
        const p = point(landmark, width, height);
        if (pointIndex === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
      ctx.fillStyle = '#e7fb54';
      ctx.fillText(`PRIMARY / ${Math.round(score)}%`, x, Math.max(13, y - 7));
    }
  });
  ctx.restore();
}
