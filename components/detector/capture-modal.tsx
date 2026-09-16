"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import type { CaptureResult } from "@/lib/vision/types";

export function CaptureModal({
   capture,
   onClose,
   onRetake,
}: {
   capture: CaptureResult;
   onClose: () => void;
   onRetake: () => void;
}) {
   const panelRef = useRef<HTMLDivElement>(null);
   const closeButtonRef = useRef<HTMLButtonElement>(null);
   useEffect(() => {
      const panel = panelRef.current;
      if (!panel) return;
      closeButtonRef.current?.focus();
      const ctx = gsap.context(
         () =>
            gsap.fromTo(
               panel,
               { y: 28, opacity: 0, clipPath: "inset(0 0 8% 0)" },
               {
                  y: 0,
                  opacity: 1,
                  clipPath: "inset(0 0 0% 0)",
                  duration: 0.6,
                  ease: "power4.out",
               },
            ),
         panel,
      );
      const handleKeyDown = (event: KeyboardEvent) => {
         if (event.key === "Escape") onClose();
         if (event.key !== "Tab") return;
         const focusable = Array.from(
            panel.querySelectorAll<HTMLElement>("button, a[href]"),
         );
         if (!focusable.length) return;
         const first = focusable[0];
         const last = focusable[focusable.length - 1];
         if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
         } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
         }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
         ctx.revert();
         window.removeEventListener("keydown", handleKeyDown);
      };
   }, [onClose]);

   const save = () => {
      const link = document.createElement("a");
      link.href = capture.dataUrl;
      link.download = `masmile-${capture.score}.png`;
      link.click();
   };

   return (
      <div
         className="modal-backdrop"
         role="dialog"
         aria-modal="true"
         aria-labelledby="capture-title"
      >
         <div
            ref={panelRef}
            className="modal-panel grid md:grid-cols-[1.2fr_.8fr]"
         >
            <div className="capture-image-wrap relative min-h-[300px] md:min-h-[510px]">
               <Image
                  src={capture.dataUrl}
                  alt={`Captured moment with an estimated smile score of ${capture.score} percent`}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-contain"
               />
            </div>
            <div className="flex flex-col p-6 md:p-8">
               <div className="flex items-center justify-between">
                  <p className="eyebrow">Captured moment</p>
                  <button
                     ref={closeButtonRef}
                     type="button"
                     onClick={onClose}
                     className="text-2xl leading-none"
                     aria-label="Close capture result"
                  >
                     ×
                  </button>
               </div>
               <div className="mt-auto pt-14">
                  <p
                     id="capture-title"
                     className="font-display text-7xl tracking-[-.1em] md:text-8xl"
                  >
                     {capture.score}
                     <span className="text-3xl tracking-[-.04em]">%</span>
                  </p>
                  <p className="mt-2 text-[10px] uppercase tracking-[.14em] text-black/50">
                     Estimated smile intensity
                  </p>
                  <div className="mt-8 border-t border-black/10 pt-4 text-xs leading-relaxed text-black/60">
                     A local frame, analyzed in your browser. Nothing was
                     uploaded.
                  </div>
               </div>
               <div className="mt-10 flex flex-col gap-2 sm:flex-row md:flex-col">
                  <button
                     type="button"
                     className="signal-button w-full text-[10px] font-semibold uppercase tracking-[.13em]"
                     onClick={save}
                  >
                     Save image <span>↓</span>
                  </button>
                  <button
                     type="button"
                     className="ghost-button w-full text-[10px] font-semibold uppercase tracking-[.13em]"
                     onClick={onRetake}
                  >
                     Retake
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}
