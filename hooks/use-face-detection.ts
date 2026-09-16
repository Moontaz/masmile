"use client";

import { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { VISION_CONFIG } from "@/data/config";
import { drawDetectionOverlay } from "@/lib/vision/render-overlay";
import type { DetectedFace, FaceBounds, Point } from "@/lib/vision/types";

type ModelStatus = "idle" | "loading" | "ready" | "error";
interface DetectionFrame {
   faces: DetectedFace[];
   primaryFace: DetectedFace | null;
   now: number;
}

function boundsFor(landmarks: Point[]): FaceBounds {
   const xs = landmarks.map((point) => point.x);
   const ys = landmarks.map((point) => point.y);
   const minX = Math.max(0, Math.min(...xs));
   const maxX = Math.min(1, Math.max(...xs));
   const minY = Math.max(0, Math.min(...ys));
   const maxY = Math.min(1, Math.max(...ys));
   return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

function smoothBounds(
   previous: FaceBounds | null,
   next: FaceBounds,
   amount: number,
): FaceBounds {
   if (!previous) return next;
   return {
      x: previous.x + (next.x - previous.x) * amount,
      y: previous.y + (next.y - previous.y) * amount,
      width: previous.width + (next.width - previous.width) * amount,
      height: previous.height + (next.height - previous.height) * amount,
   };
}

export function useFaceDetection(
   videoRef: React.RefObject<HTMLVideoElement>,
   canvasRef: React.RefObject<HTMLCanvasElement>,
   enabled: boolean,
   scoreRef: React.MutableRefObject<number>,
   onFrame: (frame: DetectionFrame) => void,
) {
   const [modelStatus, setModelStatus] = useState<ModelStatus>("idle");
   const onFrameRef = useRef(onFrame);
   const rafRef = useRef<number | null>(null);
   const landmarkerRef = useRef<FaceLandmarker | null>(null);
   const smoothBoxRef = useRef<FaceBounds | null>(null);
   const lastCallbackRef = useRef(0);
   onFrameRef.current = onFrame;

   useEffect(() => {
      if (!enabled) {
         if (rafRef.current) cancelAnimationFrame(rafRef.current);
         rafRef.current = null;
         setModelStatus("idle");
         return;
      }

      let disposed = false;
      const initialize = async () => {
         setModelStatus("loading");
         try {
            const vision = await FilesetResolver.forVisionTasks(
               "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm",
            );
            const landmarker = await FaceLandmarker.createFromOptions(vision, {
               baseOptions: {
                  modelAssetPath:
                     "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
                  delegate: "GPU",
               },
               runningMode: "VIDEO",
               numFaces: VISION_CONFIG.maxFaces,
               minFaceDetectionConfidence: 0.55,
               minFacePresenceConfidence: 0.55,
               minTrackingConfidence: 0.5,
            });
            if (disposed) {
               landmarker.close();
               return;
            }
            landmarkerRef.current = landmarker;
            setModelStatus("ready");
            const loop = () => {
               if (disposed) return;
               const video = videoRef.current;
               const canvas = canvasRef.current;
               if (
                  !video ||
                  !canvas ||
                  video.readyState < 2 ||
                  video.videoWidth === 0
               ) {
                  rafRef.current = requestAnimationFrame(loop);
                  return;
               }
               if (
                  canvas.width !== video.videoWidth ||
                  canvas.height !== video.videoHeight
               ) {
                  canvas.width = video.videoWidth;
                  canvas.height = video.videoHeight;
               }
               const now = performance.now();
               try {
                  const result = landmarker.detectForVideo(video, now);
                  const faces: DetectedFace[] = result.faceLandmarks.map(
                     (landmarks) => {
                        const points: Point[] = landmarks.map((point) => ({
                           x: point.x,
                           y: point.y,
                           z: point.z,
                        }));
                        return { landmarks: points, bounds: boundsFor(points) };
                     },
                  );
                  const primaryIndex = faces.reduce(
                     (best, face, index) =>
                        face.bounds.width * face.bounds.height >
                        (faces[best]?.bounds.width ?? 0) *
                           (faces[best]?.bounds.height ?? 0)
                           ? index
                           : best,
                     0,
                  );
                  const primaryFace = faces[primaryIndex] ?? null;
                  if (primaryFace)
                     smoothBoxRef.current = smoothBounds(
                        smoothBoxRef.current,
                        primaryFace.bounds,
                        VISION_CONFIG.boxSmoothing,
                     );
                  else smoothBoxRef.current = null;
                  drawDetectionOverlay(
                     canvas,
                     faces,
                     primaryIndex,
                     smoothBoxRef.current,
                     scoreRef.current,
                  );
                  if (now - lastCallbackRef.current > 120) {
                     lastCallbackRef.current = now;
                     onFrameRef.current({ faces, primaryFace, now });
                  }
               } catch {
                  // A frame can be skipped while the video is changing tracks or dimensions.
               }
               rafRef.current = requestAnimationFrame(loop);
            };
            rafRef.current = requestAnimationFrame(loop);
         } catch {
            if (!disposed) setModelStatus("error");
         }
      };
      initialize();
      return () => {
         disposed = true;
         if (rafRef.current) cancelAnimationFrame(rafRef.current);
         rafRef.current = null;
         landmarkerRef.current?.close();
         landmarkerRef.current = null;
         smoothBoxRef.current = null;
      };
   }, [canvasRef, enabled, scoreRef, videoRef]);

   return modelStatus;
}
