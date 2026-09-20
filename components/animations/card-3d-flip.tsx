"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const TILT_CONFIG = {
   maxTilt: 14,
   perspective: 700,
   hoverScale: 1.08,
   ease: "power2.out",
} as const;

/**
 * Interactive 3D tilt card. Rotates in 3D space toward the cursor with a
 * following glare highlight. Desktop / fine-pointer only, and skipped
 * entirely when the user prefers reduced motion.
 */
export function Card3DFlip({ className = "" }: { className?: string }) {
   const wrapRef = useRef<HTMLDivElement>(null);
   const cardRef = useRef<HTMLDivElement>(null);
   const glareRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const card = cardRef.current;
      const wrap = wrapRef.current;
      const glare = glareRef.current;
      if (!card || !wrap || !glare) return;

      const reducedMotion = window.matchMedia(
         "(prefers-reduced-motion: reduce)",
      ).matches;
      const finePointer = window.matchMedia("(pointer: fine)").matches;
      if (reducedMotion || !finePointer) return;

      let bounds: DOMRect | null = null;
      let moveHandler: ((event: MouseEvent) => void) | null = null;

      const rotateX = gsap.quickTo(card, "rotationX", {
         duration: 0.5,
         ease: TILT_CONFIG.ease,
      });
      const rotateY = gsap.quickTo(card, "rotationY", {
         duration: 0.5,
         ease: TILT_CONFIG.ease,
      });
      const scale = gsap.quickTo(card, "scale", {
         duration: 0.5,
         ease: TILT_CONFIG.ease,
      });
      const glareOpacity = gsap.quickTo(glare, "opacity", {
         duration: 0.4,
         ease: TILT_CONFIG.ease,
      });
      const setGlare = gsap.quickSetter(glare, "background");

      gsap.set(card, {
         transformPerspective: TILT_CONFIG.perspective,
         transformStyle: "preserve-3d",
         force3D: true,
      });

      const move = (event: MouseEvent) => {
         if (!bounds) return;
         const offsetX = event.clientX - bounds.left;
         const offsetY = event.clientY - bounds.top;
         const centerOffsetX = offsetX - bounds.width / 2;
         const centerOffsetY = offsetY - bounds.height / 2;
         const tiltUnit = 400 / TILT_CONFIG.maxTilt;

         rotateY(centerOffsetX / tiltUnit);
         rotateX(-centerOffsetY / tiltUnit);
         setGlare(
            `radial-gradient(circle at ${offsetX * 2 - bounds.width / 2}px ${offsetY * 2 - bounds.height / 2}px, rgba(255,255,255,.32), rgba(255,255,255,0) 60%)`,
         );
      };

      const enter = () => {
         bounds = card.getBoundingClientRect();
         moveHandler = move;
         document.addEventListener("mousemove", move);
         scale(TILT_CONFIG.hoverScale);
         glareOpacity(1);
      };

      const leave = () => {
         if (moveHandler) {
            document.removeEventListener("mousemove", moveHandler);
            moveHandler = null;
         }
         bounds = null;
         rotateX(0);
         rotateY(0);
         scale(1);
         glareOpacity(0);
      };

      card.addEventListener("mouseenter", enter);
      card.addEventListener("mouseleave", leave);

      return () => {
         card.removeEventListener("mouseenter", enter);
         card.removeEventListener("mouseleave", leave);
         if (moveHandler)
            document.removeEventListener("mousemove", moveHandler);
         gsap.killTweensOf([card, glare]);
         gsap.set([card, glare], { clearProps: "all" });
      };
   }, []);

   return (
      <div
         ref={wrapRef}
         className={`card-3d-wrap ${className}`}
         aria-hidden="true"
      >
         <div ref={cardRef} className="card-3d-item">
            <div className="card-3d-frame">
               <div className="card-3d-head">
                  <span>Masmile</span>
                  <span>Spec / 01</span>
               </div>
               <svg
                  viewBox="0 0 100 100"
                  className="card-3d-face"
                  focusable="false"
               >
                  <path d="M14 26 v-12 h12" />
                  <path d="M86 26 v-12 h-12" />
                  <path d="M14 74 v12 h12" />
                  <path d="M86 74 v12 h-12" />
                  <circle cx="38" cy="44" r="2.4" />
                  <circle cx="62" cy="44" r="2.4" />
                  <path className="card-3d-smile" d="M32 56 q18 16 36 0" />
               </svg>
               <div className="card-3d-foot">
                  <span>Smile index / 92</span>
                  <span>Local / canvas</span>
               </div>
            </div>
            <div ref={glareRef} className="card-3d-glare" />
         </div>
      </div>
   );
}
