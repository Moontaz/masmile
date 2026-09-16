"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PageEntrance } from "@/components/animations/page-entrance";
import { CaptureModal } from "@/components/detector/capture-modal";
import { DetectionStatus } from "@/components/detector/detection-status";
import { SessionStats } from "@/components/detector/session-stats";
import { SMILE_THRESHOLDS, VISION_CONFIG } from "@/data/config";
import { useCamera } from "@/hooks/use-camera";
import { useFaceDetection } from "@/hooks/use-face-detection";
import { estimateSmile } from "@/lib/vision/smile-analysis";
import type {
   CaptureResult,
   DetectionStatus as Status,
   SessionEvent,
} from "@/lib/vision/types";

function statusForScore(score: number): Status {
   if (score >= SMILE_THRESHOLDS.big) return "big-smile";
   if (score >= SMILE_THRESHOLDS.smiling) return "smiling";
   if (score >= SMILE_THRESHOLDS.slight) return "slight-smile";
   return "analyzing";
}

export function DetectorApp() {
   const videoRef = useRef<HTMLVideoElement>(null);
   const canvasRef = useRef<HTMLCanvasElement>(null);
   const scoreRef = useRef(0);
   const previousScoreRef = useRef(0);
   const lastFaceRef = useRef(0);
   const lastEventRef = useRef(0);
   const eventIdRef = useRef(0);
   const pulseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
   const [score, setScore] = useState(0);
   const [status, setStatus] = useState<Status>("camera-off");
   const [faces, setFaces] = useState(0);
   const [events, setEvents] = useState<SessionEvent[]>([]);
   const [capture, setCapture] = useState<CaptureResult | null>(null);
   const closeCapture = useCallback(() => setCapture(null), []);
   const camera = useCamera(videoRef);
   const modelStatus = useFaceDetection(
      videoRef,
      canvasRef,
      camera.status === "ready",
      scoreRef,
      useCallback(({ faces: detectedFaces, primaryFace, now }) => {
         setFaces((previous) =>
            previous === detectedFaces.length ? previous : detectedFaces.length,
         );
         if (!primaryFace) {
            if (now - lastFaceRef.current > VISION_CONFIG.lostGraceMs) {
               setStatus((current) =>
                  current === "no-face" ? current : "no-face",
               );
               scoreRef.current *= 0.88;
               if (scoreRef.current < 1) scoreRef.current = 0;
               setScore(Math.round(scoreRef.current));
            }
            return;
         }
         lastFaceRef.current = now;
         const smile = estimateSmile(primaryFace.landmarks);
         if (!smile) {
            setStatus("face-detected");
            return;
         }
         const nextScore =
            scoreRef.current +
            (smile.score - scoreRef.current) * VISION_CONFIG.scoreSmoothing;
         scoreRef.current = nextScore;
         const roundedScore = Math.round(nextScore);
         setScore((previous) =>
            previous === roundedScore ? previous : roundedScore,
         );
         const previousScore = previousScoreRef.current;
         previousScoreRef.current = roundedScore;
         if (
            previousScore < SMILE_THRESHOLDS.detected &&
            roundedScore >= SMILE_THRESHOLDS.detected &&
            now - lastEventRef.current > VISION_CONFIG.eventCooldownMs
         ) {
            lastEventRef.current = now;
            eventIdRef.current += 1;
            const event: SessionEvent = {
               id: eventIdRef.current,
               score: roundedScore,
               timestamp: Date.now(),
            };
            setEvents((current) => [...current, event]);
            setStatus("smile-detected");
            if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
            pulseTimerRef.current = setTimeout(
               () => setStatus(statusForScore(scoreRef.current)),
               1400,
            );
         } else {
            setStatus(statusForScore(roundedScore));
         }
      }, []),
   );

   useEffect(() => {
      if (camera.status === "off") setStatus("camera-off");
      if (camera.status === "ready" && modelStatus !== "ready")
         setStatus(modelStatus === "error" ? "error" : "initializing");
      if (
         camera.status === "denied" ||
         camera.status === "error" ||
         camera.status === "unavailable"
      )
         setStatus("error");
   }, [camera.status, modelStatus]);

   useEffect(
      () => () => {
         if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
      },
      [],
   );

   const startDetection = () => {
      scoreRef.current = 0;
      previousScoreRef.current = 0;
      setScore(0);
      setStatus("initializing");
      void camera.start();
   };

   const stopDetection = () => {
      camera.stop();
      setFaces(0);
      setScore(0);
      scoreRef.current = 0;
      previousScoreRef.current = 0;
      setStatus("camera-off");
   };

   const retryDetection = () => {
      camera.stop();
      window.setTimeout(() => void camera.start(), 150);
   };

   const captureMoment = () => {
      const video = videoRef.current;
      if (!video || video.readyState < 2) return;
      const width = video.videoWidth;
      const height = video.videoHeight;
      const snapshot = document.createElement("canvas");
      snapshot.width = width;
      snapshot.height = height;
      const context = snapshot.getContext("2d");
      if (!context) return;
      context.translate(width, 0);
      context.scale(-1, 1);
      context.drawImage(video, 0, 0, width, height);
      setCapture({
         dataUrl: snapshot.toDataURL("image/png"),
         score: Math.round(scoreRef.current),
         timestamp: Date.now(),
      });
   };

   return (
      <PageEntrance>
         <div className="site-grid min-h-screen px-5 pb-16 pt-[116px] md:px-10 md:pb-24 md:pt-[140px]">
            <div className="mx-auto max-w-[1600px]">
               <div className="mb-8 flex items-end justify-between border-b border-black/15 pb-5 md:mb-12">
                  <div data-reveal-fade>
                     <p className="eyebrow">Live instrument / 01</p>
                     <h1
                        data-reveal-line
                        className="reveal-line mt-4 font-display text-[clamp(42px,7vw,104px)] leading-[.86] tracking-display"
                     >
                        <span>
                           Smile
                           <br className="md:hidden" /> detector.
                        </span>
                     </h1>
                  </div>
                  <div
                     data-reveal-fade
                     className="hidden max-w-[220px] text-right text-xs leading-relaxed text-black/50 md:block"
                  >
                     A local browser experiment reading facial landmarks and
                     estimating one visible signal: your smile.
                  </div>
                  <span
                     data-reveal-fade
                     className="font-mono text-[10px] text-black/45"
                  >
                     02 / 05
                  </span>
               </div>

               <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_360px]">
                  <div data-reveal-fade>
                     <div className="camera-stage">
                        <video
                           ref={videoRef}
                           className="camera-video"
                           data-ready={camera.status === "ready"}
                           playsInline
                           autoPlay
                           muted
                           aria-label="Live camera preview"
                        />
                        <canvas
                           ref={canvasRef}
                           className="camera-overlay"
                           aria-hidden="true"
                        />
                        <div className="stage-grid" aria-hidden="true" />
                        <span className="stage-corner tl" />
                        <span className="stage-corner tr" />
                        <span className="stage-corner bl" />
                        <span className="stage-corner br" />
                        <span className="stage-label">
                           Face landmarks / local
                        </span>
                        {camera.status === "ready" && (
                           <span className="stage-live">
                              {modelStatus === "ready"
                                 ? "Tracking"
                                 : modelStatus === "error"
                                   ? "Model unavailable"
                                   : "Loading model"}
                           </span>
                        )}
                        {camera.status === "ready" &&
                           modelStatus === "error" && (
                              <div className="stage-empty">
                                 <p className="mb-2 font-display text-2xl tracking-[-.05em]">
                                    Detection unavailable.
                                 </p>
                                 <p className="mb-7 max-w-[290px] text-xs leading-relaxed text-white/55">
                                    The local landmark model could not
                                    initialize.
                                 </p>
                                 <button
                                    type="button"
                                    onClick={retryDetection}
                                    className="ghost-button border-white/35 text-[10px] font-semibold uppercase tracking-[.14em] text-white hover:border-white hover:bg-white/10"
                                 >
                                    Retry model <span>↗</span>
                                 </button>
                              </div>
                           )}
                        {camera.status !== "ready" && (
                           <div className="stage-empty">
                              {camera.status === "off" && (
                                 <>
                                    <p className="mb-2 font-display text-2xl tracking-[-.05em]">
                                       Ready when you are.
                                    </p>
                                    <p className="mb-7 max-w-[250px] text-xs leading-relaxed text-white/55">
                                       Your camera stays off until you
                                       explicitly start the detector.
                                    </p>
                                    <button
                                       type="button"
                                       onClick={startDetection}
                                       className="signal-button text-[10px] font-semibold uppercase tracking-[.14em]"
                                    >
                                       Start detection <span>↗</span>
                                    </button>
                                 </>
                              )}
                              {(camera.status === "requesting" ||
                                 camera.status === "starting") && (
                                 <>
                                    <p className="mb-2 font-display text-2xl tracking-[-.05em]">
                                       Requesting camera.
                                    </p>
                                    <p className="text-xs text-white/55">
                                       Allow access in your browser to continue.
                                    </p>
                                 </>
                              )}
                              {(camera.status === "denied" ||
                                 camera.status === "unavailable" ||
                                 camera.status === "error") && (
                                 <>
                                    <p className="mb-2 font-display text-2xl tracking-[-.05em]">
                                       {camera.status === "denied"
                                          ? "Camera access required."
                                          : camera.status === "unavailable"
                                            ? "No camera found."
                                            : "Unable to start camera."}
                                    </p>
                                    <p className="mb-7 max-w-[290px] text-xs leading-relaxed text-white/55">
                                       {camera.error ??
                                          "Check your camera connection and try again."}
                                    </p>
                                    <button
                                       type="button"
                                       onClick={startDetection}
                                       className="ghost-button border-white/35 text-[10px] font-semibold uppercase tracking-[.14em] text-white hover:border-white hover:bg-white/10"
                                    >
                                       Try again <span>↗</span>
                                    </button>
                                 </>
                              )}
                           </div>
                        )}
                     </div>
                     <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[9px] uppercase tracking-[.13em] text-black/45">
                        <span>
                           Camera:{" "}
                           {camera.status === "ready" ? "connected" : "standby"}
                        </span>
                        <span>
                           {faces > 1
                              ? `${faces} faces detected`
                              : faces === 1
                                ? "1 face detected"
                                : "Awaiting subject"}
                        </span>
                        <span>Processing: on-device</span>
                     </div>
                  </div>

                  <aside
                     data-reveal-fade
                     className="flex flex-col border-t border-black/15 lg:border-t-0"
                  >
                     <div className="flex items-start justify-between border-b border-black/15 py-5 lg:pt-0">
                        <div>
                           <p className="eyebrow">Estimated intensity</p>
                           <p className="mt-3 text-xs text-black/50">
                              Not a medical or psychological measurement.
                           </p>
                        </div>
                        <span className="font-mono text-[10px] text-black/40">
                           {String(score).padStart(2, "0")}
                        </span>
                     </div>
                     <div
                        className={`border-b border-black/15 py-7 transition-colors ${status === "smile-detected" ? "bg-[#e7fb54]/50" : ""}`}
                     >
                        <p className="font-display text-[clamp(88px,11vw,150px)] leading-[.75] tracking-[-.12em]">
                           {score}
                           <span className="ml-2 text-2xl tracking-[-.05em]">
                              %
                           </span>
                        </p>
                        <div className="score-meter mt-8">
                           <span style={{ width: `${score}%` }} />
                        </div>
                        <div className="mt-3 flex justify-between text-[9px] uppercase tracking-[.12em] text-black/45">
                           <span>Neutral</span>
                           <span>Big smile</span>
                        </div>
                     </div>
                     <div className="py-5">
                        <DetectionStatus status={status} />
                     </div>
                     <div className="mt-auto border-t border-black/15 pt-5">
                        <button
                           type="button"
                           onClick={captureMoment}
                           disabled={
                              camera.status !== "ready" ||
                              modelStatus !== "ready"
                           }
                           className="signal-button w-full text-[10px] font-semibold uppercase tracking-[.14em] disabled:cursor-not-allowed disabled:border-black/20 disabled:bg-transparent disabled:text-black/30"
                        >
                           Capture moment <span>◎</span>
                        </button>
                        {camera.status === "ready" && (
                           <button
                              type="button"
                              onClick={stopDetection}
                              className="mt-2 w-full py-3 text-[9px] uppercase tracking-[.14em] text-black/45 transition-colors hover:text-black"
                           >
                              End camera session
                           </button>
                        )}
                     </div>
                  </aside>
               </div>

               <div className="mt-16 grid gap-10 border-t border-black/15 pt-7 md:mt-24 md:grid-cols-[1fr_1fr_1fr]">
                  <div data-reveal-fade>
                     <p className="eyebrow">How to use</p>
                     <p className="mt-5 max-w-[300px] text-sm leading-relaxed text-black/65">
                        Place your face in the frame. The primary subject is the
                        largest face detected. Hold a smile to register an
                        event.
                     </p>
                  </div>
                  <div data-reveal-fade>
                     <p className="eyebrow">Signal map</p>
                     <div className="mt-5 space-y-3 text-xs text-black/65">
                        <div className="flex justify-between border-b border-black/10 pb-2">
                           <span>00—30 / neutral</span>
                           <span>01</span>
                        </div>
                        <div className="flex justify-between border-b border-black/10 pb-2">
                           <span>30—60 / slight</span>
                           <span>02</span>
                        </div>
                        <div className="flex justify-between border-b border-black/10 pb-2">
                           <span>60—80 / smiling</span>
                           <span>03</span>
                        </div>
                        <div className="flex justify-between pb-2">
                           <span>80—100 / big</span>
                           <span>04</span>
                        </div>
                     </div>
                  </div>
                  <div data-reveal-fade>
                     <SessionStats
                        events={events}
                        onClear={() => setEvents([])}
                     />
                  </div>
               </div>
               <p className="mt-16 max-w-[650px] border-l-2 border-[#e7fb54] pl-4 text-[11px] leading-relaxed text-black/50">
                  Privacy note — video frames are processed locally in this
                  browser. No images or biometric data are sent to a server. The
                  estimated smile score is derived from landmark geometry and
                  should not be interpreted as scientific, medical, or
                  psychological analysis.
               </p>
            </div>
         </div>
         {capture && (
            <CaptureModal
               capture={capture}
               onClose={closeCapture}
               onRetake={closeCapture}
            />
         )}
      </PageEntrance>
   );
}
