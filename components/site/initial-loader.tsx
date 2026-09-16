'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export function InitialLoader() {
  const [complete, setComplete] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.timeline({
        delay: .08,
        onComplete: () => setComplete(true),
      })
        .fromTo('.loader-mark', { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: .35, ease: 'power3.out' })
        .fromTo('.loader-bar span', { scaleX: 0 }, { scaleX: 1, duration: .58, ease: 'power3.inOut' }, '-=.08')
        .to(root, { clipPath: 'inset(0 0 100% 0)', duration: .58, ease: 'power4.inOut' });
    }, root);
    return () => ctx.revert();
  }, []);

  if (complete) return null;
  return <div ref={ref} className="fixed inset-0 z-[110] flex flex-col justify-between bg-[#e7fb54] p-5 md:p-10" aria-label="Loading masmile" role="status">
    <div className="flex justify-between text-[9px] uppercase tracking-[.16em]"><span className="loader-mark">masmile / 01</span><span className="loader-mark">Local browser vision</span></div>
    <div className="max-w-[360px]"><p className="loader-mark font-display text-5xl leading-[.85] tracking-[-.09em]">Initializing<br />experience<span className="text-white">.</span></p><div className="loader-bar mt-8 h-px bg-black/20"><span className="block h-full origin-left bg-black" /></div><div className="mt-3 flex justify-between text-[9px] uppercase tracking-[.15em]"><span>Loading</span><span>Ready in a moment</span></div></div>
    <div className="flex justify-between text-[9px] uppercase tracking-[.16em]"><span>Camera remains off</span><span>© 2024—now</span></div>
  </div>;
}
