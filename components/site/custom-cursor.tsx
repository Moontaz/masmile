'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    document.body.classList.add('custom-cursor');
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    const move = (event: MouseEvent) => {
      gsap.to(dot, { x: event.clientX, y: event.clientY, duration: .12, ease: 'power2.out' });
      gsap.to(ring, { x: event.clientX, y: event.clientY, duration: .42, ease: 'power3.out' });
      dot.style.opacity = '1'; ring.style.opacity = '1';
    };
    const over = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      ring.dataset.hover = String(Boolean(target.closest('a, button, [data-cursor]')));
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    return () => {
      document.body.classList.remove('custom-cursor');
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
    };
  }, []);

  return <><div ref={dotRef} className="cursor-dot" /><div ref={ringRef} className="cursor-ring" /></>;
}
