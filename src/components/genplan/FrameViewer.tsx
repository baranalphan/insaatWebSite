"use client";

import { useCallback, useEffect, useImperativeHandle, useRef, useState, forwardRef } from "react";
import { FRAME_COUNT, nearestControlFrame } from "./types";

export interface FrameViewerHandle {
  rotate: (dir: 1 | -1) => void;
}

interface FrameViewerProps {
  /** e.g. "masterplan" | "masterplan_dark" | "1_outside" */
  frameSet: string;
  onProgress: (percent: number) => void;
  onReady: () => void;
  onRotatingChange: (rotating: boolean) => void;
  onSettle: (controlFrame: number, frame: number) => void;
  onFrame?: (frame: number) => void;
}

const framePath = (set: string, i: number) => `/genplan/flyby/${set}/${i}.jpg`;
const mod = (n: number) => ((n % FRAME_COUNT) + FRAME_COUNT) % FRAME_COUNT;

/**
 * 120-frame flyby viewer: preloads the active set, supports drag rotation
 * (mouseSpeed 0.5 ≈ 1 frame / 10px) and animated arrow steps, then settles
 * on the nearest control frame [1,31,61,91].
 */
export const FrameViewer = forwardRef<FrameViewerHandle, FrameViewerProps>(function FrameViewer(
  { frameSet, onProgress, onReady, onRotatingChange, onSettle, onFrame },
  ref,
) {
  const [frame, setFrame] = useState(31);
  const [ready, setReady] = useState(false);
  const frameRef = useRef(31);
  const rafRef = useRef(0);
  const dragRef = useRef<{ startX: number; startFrame: number; moved: boolean } | null>(null);

  const setFrameBoth = useCallback(
    (f: number) => {
      const m = mod(Math.round(f));
      frameRef.current = m;
      setFrame(m);
      onFrame?.(m);
    },
    [onFrame],
  );

  /* preload the active frame set */
  useEffect(() => {
    let cancelled = false;
    let loaded = 0;
    setReady(false);
    onProgress(0);
    const images: HTMLImageElement[] = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.onload = img.onerror = () => {
        if (cancelled) return;
        loaded++;
        onProgress(Math.round((loaded / FRAME_COUNT) * 100));
        if (loaded === FRAME_COUNT) {
          setReady(true);
          onReady();
          onSettle(nearestControlFrame(frameRef.current), frameRef.current);
        }
      };
      img.src = framePath(frameSet, i);
      images.push(img);
    }
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameSet]);

  const settle = useCallback(() => {
    const target = nearestControlFrame(frameRef.current);
    const start = frameRef.current;
    let diff = target - start;
    if (diff > FRAME_COUNT / 2) diff -= FRAME_COUNT;
    if (diff < -FRAME_COUNT / 2) diff += FRAME_COUNT;
    if (diff === 0) {
      onRotatingChange(false);
      onSettle(target, target);
      return;
    }
    const t0 = performance.now();
    const dur = Math.abs(diff) * 50; /* rotateSpeed 20 frames/sec */
    const step = (t: number) => {
      const p = Math.min((t - t0) / dur, 1);
      setFrameBoth(start + diff * p);
      if (p < 1) rafRef.current = requestAnimationFrame(step);
      else {
        onRotatingChange(false);
        onSettle(target, target);
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, [onRotatingChange, onSettle, setFrameBoth]);

  const rotate = useCallback(
    (dir: 1 | -1) => {
      if (!ready) return;
      cancelAnimationFrame(rafRef.current);
      onRotatingChange(true);
      const start = frameRef.current;
      const target = start + dir * 30; /* next control frame */
      const t0 = performance.now();
      const dur = 1500;
      const step = (t: number) => {
        const p = Math.min((t - t0) / dur, 1);
        setFrameBoth(start + dir * 30 * p);
        if (p < 1) rafRef.current = requestAnimationFrame(step);
        else {
          setFrameBoth(target);
          onRotatingChange(false);
          onSettle(nearestControlFrame(mod(target)), mod(target));
        }
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [ready, onRotatingChange, onSettle, setFrameBoth],
  );

  useImperativeHandle(ref, () => ({ rotate }), [rotate]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!ready) return;
    cancelAnimationFrame(rafRef.current);
    dragRef.current = { startX: e.clientX, startFrame: frameRef.current, moved: false };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = e.clientX - drag.startX;
    if (Math.abs(dx) > 3 && !drag.moved) {
      drag.moved = true;
      onRotatingChange(true);
    }
    if (drag.moved) setFrameBoth(drag.startFrame + (dx * 0.5) / 5);
  };
  const onPointerUp = () => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (drag?.moved) settle();
  };

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <div
      className="s3d-frame-viewer unselectable"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {ready && <img src={framePath(frameSet, frame)} alt="" draggable={false} />}
    </div>
  );
});
