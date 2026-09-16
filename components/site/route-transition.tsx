'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function RouteTransition() {
  const pathname = usePathname();
  const wipeRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useEffect(() => {
    const wipe = wipeRef.current;
    if (!wipe) return;
    if (first.current) {
      first.current = false;
      gsap.fromTo(wipe, { yPercent: 0 }, { yPercent: -101, duration: .8, ease: 'power4.inOut', delay: .05 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(wipe, { yPercent: -101 }, { yPercent: 0, duration: .45, ease: 'power4.inOut', onComplete: () => {
        gsap.to(wipe, { yPercent: -101, duration: .55, ease: 'power4.inOut', delay: .06 });
      }});
    });
    return () => ctx.revert();
  }, [pathname]);

  return <div ref={wipeRef} className="route-wipe" aria-hidden="true" />;
}
