import type { Point, SmileResult } from './types';

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const remap = (value: number, fromMin: number, fromMax: number) =>
  clamp((value - fromMin) / (fromMax - fromMin));
const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

/**
 * Estimates smile intensity from normalized MediaPipe landmarks.
 * This is intentionally a geometry heuristic, not emotion recognition.
 */
export function estimateSmile(landmarks: Point[]): SmileResult | null {
  const leftCorner = landmarks[61];
  const rightCorner = landmarks[291];
  const upperLip = landmarks[13];
  const lowerLip = landmarks[14];
  const leftFace = landmarks[234];
  const rightFace = landmarks[454];

  if (!leftCorner || !rightCorner || !upperLip || !lowerLip || !leftFace || !rightFace) {
    return null;
  }

  const faceWidth = Math.max(distance(leftFace, rightFace), 0.001);
  const mouthWidth = distance(leftCorner, rightCorner) / faceWidth;
  const mouthHeight = distance(upperLip, lowerLip) / faceWidth;
  const mouthMidY = (upperLip.y + lowerLip.y) / 2;
  const cornerY = (leftCorner.y + rightCorner.y) / 2;
  const cornerLift = (mouthMidY - cornerY) / faceWidth;

  const widthSignal = remap(mouthWidth, 0.31, 0.53);
  const opennessSignal = remap(mouthHeight, 0.025, 0.16);
  const liftSignal = remap(cornerLift, -0.015, 0.075);
  const score = Math.round(clamp(widthSignal * 0.44 + opennessSignal * 0.16 + liftSignal * 0.4) * 100);

  return {
    score,
    mouthWidth,
    mouthHeight,
    cornerLift,
    confidence: clamp(0.6 + Math.min(0.3, faceWidth)),
  };
}
