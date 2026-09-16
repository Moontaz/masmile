import type { DetectionStatus } from '@/lib/vision/types';

const COPY: Record<DetectionStatus, { label: string; detail: string }> = {
  'camera-off': { label: 'Camera off', detail: 'Start the detector to begin.' },
  initializing: { label: 'Initializing', detail: 'Warming up local detection.' },
  'no-face': { label: 'No face', detail: 'Move into the frame.' },
  'face-detected': { label: 'Face detected', detail: 'Landmarks are locked.' },
  analyzing: { label: 'Analyzing', detail: 'Reading mouth geometry.' },
  'slight-smile': { label: 'Slight smile', detail: 'A signal is forming.' },
  smiling: { label: 'Smiling', detail: 'Smile intensity is rising.' },
  'big-smile': { label: 'Big smile', detail: 'Strong smile geometry.' },
  'smile-detected': { label: 'Smile detected', detail: 'Event added to this session.' },
  error: { label: 'Detection unavailable', detail: 'Try restarting the detector.' },
};

export function DetectionStatus({ status, compact = false }: { status: DetectionStatus; compact?: boolean }) {
  const copy = COPY[status];
  return <div className={`flex items-start gap-3 ${compact ? '' : 'border-t border-black/10 pt-4'}`} aria-live="polite">
    <span className={`mt-[5px] h-2 w-2 shrink-0 border border-black ${status === 'smile-detected' ? 'bg-[#e7fb54]' : status === 'no-face' ? 'bg-transparent' : 'bg-black'}`} />
    <div><p className="text-[11px] font-semibold uppercase tracking-[.1em]">{copy.label}</p><p className="mt-1 text-xs text-black/50">{copy.detail}</p></div>
  </div>;
}
