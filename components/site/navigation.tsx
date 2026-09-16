'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { SITE_NAV } from '@/data/config';

export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const ctx = gsap.context(() => {
      if (open) {
        gsap.set(menu, { display: 'flex' });
        gsap.fromTo(menu, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: .55, ease: 'power4.inOut' });
        gsap.fromTo('.mobile-nav-link', { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: .45, stagger: .07, delay: .12, ease: 'power3.out' });
      } else {
        gsap.to(menu, { clipPath: 'inset(0 0 100% 0)', duration: .4, ease: 'power4.inOut', onComplete: () => gsap.set(menu, { display: 'none' }) });
      }
    }, menuRef);
    return () => ctx.revert();
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-black/10 bg-[#f4f4f0]/85 backdrop-blur-md">
      <div className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between px-5 md:px-10">
        <Link href="/" className="group flex items-center gap-3" aria-label="masmile home">
          <span className="font-display text-[21px] font-semibold tracking-[-.08em]">masmile<span className="text-[#c8dd27]">.</span></span>
          <span className="hidden border-l border-black/20 pl-3 text-[9px] uppercase tracking-[.18em] text-black/45 sm:block">browser vision / 01</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
          {SITE_NAV.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link text-[10px] font-medium uppercase tracking-[.16em]" data-active={pathname === item.href}>
              {item.label}
            </Link>
          ))}
          <Link href="/detector" className="signal-button ml-3 min-h-[38px] px-4 text-[10px] font-semibold uppercase tracking-[.12em]">Start detection <span aria-hidden="true">↗</span></Link>
        </nav>
        <button type="button" className="relative z-[60] flex h-10 w-10 flex-col items-end justify-center gap-[5px] md:hidden" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? 'Close navigation' : 'Open navigation'}>
          <span className={`block h-px bg-black transition-all ${open ? 'w-6 -translate-y-0 rotate-45' : 'w-6'}`} />
          <span className={`block h-px bg-black transition-all ${open ? 'w-6 rotate-[-45deg]' : 'w-4'}`} />
        </button>
      </div>
      <div ref={menuRef} className="fixed inset-0 z-50 hidden flex-col justify-end bg-[#e7fb54] px-5 pb-10 pt-24 md:hidden" aria-hidden={!open}>
        <div className="mb-auto flex items-center justify-between text-[9px] uppercase tracking-[.16em]"><span>Navigation</span><span>masmile / 01</span></div>
        <div ref={linksRef} className="flex flex-col gap-1">
          {SITE_NAV.map((item, index) => <Link className="mobile-nav-link font-display text-[16vw] font-medium leading-[.9] tracking-[-.08em]" key={item.href} href={item.href}>{String(index + 1).padStart(2, '0')} <span className="text-[.32em] uppercase tracking-[.04em]">{item.label}</span></Link>)}
        </div>
        <p className="mt-10 max-w-[260px] text-xs leading-relaxed">Local browser processing. No camera frames leave this device.</p>
      </div>
    </header>
  );
}
