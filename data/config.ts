export const SMILE_THRESHOLDS = {
  slight: 30,
  smiling: 60,
  big: 80,
  detected: 72,
} as const;

export const VISION_CONFIG = {
  maxFaces: 4,
  lostGraceMs: 650,
  scoreSmoothing: 0.14,
  boxSmoothing: 0.2,
  eventCooldownMs: 2800,
} as const;

export const SITE_NAV = [
  { href: '/', label: 'Home' },
  { href: '/detector', label: 'Detector' },
  { href: '/about', label: 'About' },
] as const;
