export type CameraStatus =
  | 'off'
  | 'requesting'
  | 'starting'
  | 'ready'
  | 'denied'
  | 'unavailable'
  | 'error';

export type DetectionStatus =
  | 'camera-off'
  | 'initializing'
  | 'no-face'
  | 'face-detected'
  | 'analyzing'
  | 'slight-smile'
  | 'smiling'
  | 'big-smile'
  | 'smile-detected'
  | 'error';

export interface Point {
  x: number;
  y: number;
  z?: number;
}

export interface FaceBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DetectedFace {
  landmarks: Point[];
  bounds: FaceBounds;
  score?: number;
}

export interface SmileResult {
  score: number;
  mouthWidth: number;
  mouthHeight: number;
  cornerLift: number;
  confidence: number;
}

export interface SessionEvent {
  id: number;
  score: number;
  timestamp: number;
}

export interface CaptureResult {
  dataUrl: string;
  score: number;
  timestamp: number;
}
