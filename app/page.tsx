import Link from "next/link";
import { Card3DFlip } from "@/components/animations/card-3d-flip";
import { PageEntrance } from "@/components/animations/page-entrance";
import { ScrollReveal } from "@/components/animations/scroll-reveal";

export default function HomePage() {
   return (
      <PageEntrance>
         <div className="site-grid min-h-screen px-5 pb-20 pt-[76px] md:px-10 md:pb-28">
            <section className="relative mx-auto flex min-h-[calc(100vh-76px)] max-w-[1600px] flex-col justify-center py-20 pt-2 lg:py-20">
               <div className="absolute left-0 top-1/2 hidden -translate-y-1/2 lg:block">
                  <span className="hero-index text-[9px] uppercase tracking-[.18em] text-black/40">
                     Creative browser instrument / 2024—now
                  </span>
               </div>
               <div className="max-w-[1500px] lg:pl-16">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                     <div>
                        <p
                           data-reveal-fade
                           className="eyebrow max-w-[170px] sm:max-w-none"
                        >
                           Real-time face landmark experiment
                        </p>
                        <h1 className="mt-8 font-display text-[clamp(60px,11.4vw,190px)] font-medium leading-[.81] tracking-display">
                           <span data-reveal-line className="reveal-line">
                              <span>See your</span>
                           </span>
                           <span data-reveal-line className="reveal-line">
                              <span>
                                 smile<span className="text-[#c8dd27]">.</span>
                              </span>
                           </span>
                           <span data-reveal-line className="reveal-line">
                              <span>
                                 in real time
                                 <span className="text-[#c8dd27]">_</span>
                              </span>
                           </span>
                        </h1>
                     </div>
                     <div data-reveal-fade className="shrink-0">
                        <Card3DFlip className="w-[240px] sm:w-[184px] lg:w-[240px] xl:w-[320px]" />
                     </div>
                  </div>

                  <div className="mt-12 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between lg:max-w-[960px]">
                     <p
                        data-reveal-fade
                        className="max-w-[340px] text-sm leading-relaxed text-black/55"
                     >
                        A local, browser-based instrument that turns facial
                        landmarks into a living estimate of your smile
                        intensity.
                     </p>
                     <div data-reveal-fade className="flex items-center gap-6">
                        <Link
                           href="/detector"
                           className="signal-button text-[10px] font-semibold uppercase tracking-[.14em]"
                        >
                           Start detection <span>↗</span>
                        </Link>
                        <span className="hidden text-[9px] uppercase tracking-[.14em] text-black/40 sm:block">
                           No upload / no account
                        </span>
                     </div>
                  </div>
               </div>
               <div
                  data-reveal-fade
                  className="mt-auto flex items-end justify-between border-t border-black/15 pt-6 lg:ml-16"
               >
                  <div className="flex gap-8 text-[9px] uppercase tracking-[.14em] text-black/45">
                     <span>MediaPipe</span>
                     <span>Canvas</span>
                     <span>Web Camera API</span>
                  </div>
                  <span className="scroll-indicator hidden text-[9px] uppercase tracking-[.14em] text-black/45 md:block">
                     Scroll to explore
                  </span>
               </div>
            </section>

            <section className="mx-auto max-w-[1600px] border-t border-black/15 pt-10 md:pt-16">
               <div className="grid gap-10 md:grid-cols-[1fr_2fr] md:gap-20">
                  <ScrollReveal>
                     <p className="eyebrow">The premise / 01</p>
                  </ScrollReveal>
                  <ScrollReveal>
                     <p className="max-w-[850px] font-display text-[clamp(30px,4.5vw,68px)] leading-[.98] tracking-[-.07em]">
                        What happens when a familiar camera becomes a tiny
                        instrument for noticing something human?
                     </p>
                  </ScrollReveal>
               </div>
               <div className="mt-20 grid gap-px bg-black/15 md:grid-cols-3">
                  <ScrollReveal className="bg-[#f4f4f0] p-7 md:p-10">
                     <p className="font-mono text-[10px] text-black/40">01</p>
                     <h2 className="mt-20 font-display text-2xl tracking-[-.06em]">
                        Look
                     </h2>
                     <p className="mt-4 text-sm leading-relaxed text-black/55">
                        Your camera feed stays in the browser, where landmarks
                        are found in real time.
                     </p>
                  </ScrollReveal>
                  <ScrollReveal className="bg-[#f4f4f0] p-7 md:p-10">
                     <p className="font-mono text-[10px] text-black/40">02</p>
                     <h2 className="mt-20 font-display text-2xl tracking-[-.06em]">
                        Move
                     </h2>
                     <p className="mt-4 text-sm leading-relaxed text-black/55">
                        A smoothed frame follows your face without turning the
                        interface into a dashboard.
                     </p>
                  </ScrollReveal>
                  <ScrollReveal className="bg-[#f4f4f0] p-7 md:p-10">
                     <p className="font-mono text-[10px] text-black/40">03</p>
                     <h2 className="mt-20 font-display text-2xl tracking-[-.06em]">
                        Smile
                     </h2>
                     <p className="mt-4 text-sm leading-relaxed text-black/55">
                        Mouth geometry becomes an estimated 0—100 signal:
                        visible, immediate, yours.
                     </p>
                  </ScrollReveal>
               </div>
            </section>

            <section className="mx-auto mt-28 max-w-[1600px] border-t border-black/15 pt-8">
               <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
                  <div>
                     <p className="eyebrow">Ready when you are / 02</p>
                     <h2 className="mt-6 max-w-[780px] font-display text-[clamp(42px,7vw,104px)] leading-[.84] tracking-display">
                        Make a moment
                        <br />
                        of the moment<span className="text-[#c8dd27]">.</span>
                     </h2>
                  </div>
                  <Link
                     href="/detector"
                     className="ghost-button shrink-0 self-start text-[10px] font-semibold uppercase tracking-[.14em] md:self-end"
                  >
                     Open the instrument <span>↗</span>
                  </Link>
               </div>
            </section>
            <footer className="mx-auto mt-28 flex max-w-[1600px] flex-col justify-between gap-4 border-t border-black/15 pt-5 text-[9px] uppercase tracking-[.14em] text-black/45 sm:flex-row">
               <span>masmile © 2024—now</span>
               <span>Local processing / open experience</span>
            </footer>
         </div>
      </PageEntrance>
   );
}
