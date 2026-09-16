import Link from 'next/link';
import { PageEntrance } from '@/components/animations/page-entrance';

export default function NotFound() {
  return <PageEntrance><div className="site-grid flex min-h-screen items-center px-5 pt-[76px] md:px-10"><div className="mx-auto w-full max-w-[1600px]"><p data-reveal-fade className="eyebrow">Signal lost / 404</p><h1 data-reveal-line className="reveal-line mt-8 font-display text-[clamp(90px,20vw,300px)] leading-[.72] tracking-[-.12em]"><span>404<span className="text-[#c8dd27]">.</span></span></h1><div data-reveal-fade className="mt-16 flex flex-col justify-between gap-8 border-t border-black/15 pt-6 md:flex-row md:items-end"><p className="max-w-[330px] text-sm leading-relaxed text-black/55">This frame does not exist. The rest of the instrument is still here.</p><Link href="/" className="signal-button self-start text-[10px] font-semibold uppercase tracking-[.14em]">Return home <span>↗</span></Link></div></div></div></PageEntrance>;
}
