import Link from 'next/link';
import { PageEntrance } from '@/components/animations/page-entrance';
import { ScrollReveal } from '@/components/animations/scroll-reveal';

const steps = [
  ['01', 'Camera', 'A user-initiated webcam stream provides the live image. The feed is never sent to a server.'],
  ['02', 'Face detection', 'MediaPipe Face Landmarker finds faces and returns a dense set of normalized points.'],
  ['03', 'Facial landmarks', 'A restrained Canvas overlay visualizes a selected face, eyes, jaw, and mouth landmarks.'],
  ['04', 'Mouth analysis', 'Mouth width, openness, and corner lift are normalized against face geometry.'],
  ['05', 'Smile estimate', 'Those measurements become a smoothed 0—100 signal with configurable thresholds.'],
];

export default function AboutPage() {
  return <PageEntrance><div className="site-grid min-h-screen px-5 pb-20 pt-[126px] md:px-10 md:pb-28"><div className="mx-auto max-w-[1600px]"><header className="grid gap-10 border-b border-black/15 pb-14 md:grid-cols-[1fr_2fr] md:pb-24"><div data-reveal-fade><p className="eyebrow">About the instrument / 03</p></div><div><h1 data-reveal-line className="reveal-line font-display text-[clamp(52px,9vw,150px)] leading-[.8] tracking-display"><span>Read the<br />visible signal<span className="text-[#c8dd27]">.</span></span></h1><p data-reveal-fade className="mt-10 max-w-[490px] text-sm leading-relaxed text-black/60">masmile is a small creative technology experiment about making an invisible browser process feel tangible. It does not know how you feel. It only reads geometry and gives you a playful, immediate estimate.</p></div></header>

<section className="grid gap-10 border-b border-black/15 py-16 md:grid-cols-[1fr_2fr] md:py-24"><ScrollReveal><div><p className="eyebrow">How it works / 04</p><p className="mt-6 max-w-[220px] text-xs leading-relaxed text-black/50">One short pipeline, running locally on your device.</p></div></ScrollReveal><div className="border-t border-black/15">{steps.map(([number, title, copy]) => <ScrollReveal key={number} className="grid gap-5 border-b border-black/15 py-7 md:grid-cols-[80px_1fr_1.4fr] md:items-baseline"><span className="font-mono text-[10px] text-black/40">{number}</span><h2 className="font-display text-3xl tracking-[-.06em]">{title}</h2><p className="max-w-[390px] text-sm leading-relaxed text-black/55">{copy}</p></ScrollReveal>)}</div></section>

<section className="grid gap-12 py-16 md:grid-cols-2 md:py-24"><ScrollReveal><p className="eyebrow">Built with / 05</p><div className="mt-8 grid max-w-[500px] grid-cols-2 border-l border-t border-black/15">{['Next.js', 'TypeScript', 'MediaPipe', 'Canvas', 'Web Camera API', 'GSAP'].map((item) => <div key={item} className="border-b border-r border-black/15 px-4 py-5 text-sm">{item}</div>)}</div></ScrollReveal><ScrollReveal><p className="eyebrow">A note on the score / 06</p><p className="mt-8 max-w-[470px] font-display text-3xl leading-[1.05] tracking-[-.06em]">The number is a visual estimate, not a verdict.</p><p className="mt-6 max-w-[430px] text-sm leading-relaxed text-black/55">The detector uses mouth landmarks and face-relative proportions. Lighting, camera angle, facial structure, and movement all affect it. This is not emotion recognition, psychological analysis, or a medical tool.</p></ScrollReveal></section>

<div className="flex flex-col justify-between gap-8 border-t border-black/15 pt-8 md:flex-row md:items-end"><div><p className="eyebrow">Try it yourself / 07</p><p className="mt-5 font-display text-4xl tracking-[-.07em]">The camera is waiting.</p></div><Link href="/detector" className="signal-button self-start text-[10px] font-semibold uppercase tracking-[.14em] md:self-end">Start detection <span>↗</span></Link></div><footer className="mt-28 border-t border-black/15 pt-5 text-[9px] uppercase tracking-[.14em] text-black/45">Local by design / masmile © 2024—now</footer></div></div></PageEntrance>;
}
