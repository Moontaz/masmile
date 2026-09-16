'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { CameraStatus } from '@/lib/vision/types';

interface CameraState {
  status: CameraStatus;
  error: string | null;
}

export function useCamera(videoRef: React.RefObject<HTMLVideoElement>) {
  const streamRef = useRef<MediaStream | null>(null);
  const [state, setState] = useState<CameraState>({ status: 'off', error: null });

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setState({ status: 'off', error: null });
  }, [videoRef]);

  const start = useCallback(async () => {
    if (streamRef.current) return;
    if (!navigator.mediaDevices?.getUserMedia) {
      setState({ status: 'unavailable', error: 'This browser does not support camera access.' });
      return;
    }
    setState({ status: 'requesting', error: null });
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) throw new Error('Video element is unavailable.');
      video.srcObject = stream;
      video.muted = true;
      video.playsInline = true;
      video.onloadedmetadata = async () => {
        try {
          await video.play();
          setState({ status: 'ready', error: null });
        } catch {
          setState({ status: 'error', error: 'The camera could not start playback.' });
        }
      };
      stream.getVideoTracks()[0]?.addEventListener('ended', () => {
        streamRef.current = null;
        setState({ status: 'error', error: 'The camera connection ended.' });
      });
    } catch (error) {
      const name = error instanceof DOMException ? error.name : '';
      const denied = name === 'NotAllowedError' || name === 'SecurityError';
      setState({ status: denied ? 'denied' : 'error', error: denied ? 'Camera permission was not granted.' : 'No usable camera was found.' });
    }
  }, [videoRef]);

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  return { ...state, start, stop, stream: streamRef.current };
}
