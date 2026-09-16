'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function PageEntrance({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      const lines = root.querySelectorAll('[data-reveal-line] > span');
      const fades = root.querySelectorAll('[data-reveal-fade]');
      gsap.fromTo(lines, { yPercent: 115 }, { yPercent: 0, duration: .9, stagger: .075, ease: 'power4.out', delay: .12 });
      gsap.fromTo(fades, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .7, stagger: .06, ease: 'power3.out', delay: .3 });
    }, root);
    return () => ctx.revert();
  }, []);
  return <div ref={ref}>{children}</div>;
}
