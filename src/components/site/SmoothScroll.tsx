"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

/**
 * Replicates the original site's GSAP ScrollSmoother setup:
 * body > .smooth-wrapper (fixed) > .smooth-content (translated), smooth: 2,
 * data-speed / data-lag parallax effects enabled. Desktop pointer devices only —
 * the original scrolls natively on touch/small screens.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1025px) and (hover: hover)", () => {
      const smoother = ScrollSmoother.create({
        wrapper: wrapperRef.current!,
        content: contentRef.current!,
        smooth: 2,
        effects: true,
        normalizeScroll: false,
      });
      return () => smoother.kill();
    });
    return () => mm.revert();
  }, []);

  return (
    <div className="smooth-wrapper" ref={wrapperRef}>
      <div className="smooth-content" ref={contentRef}>
        {children}
      </div>
    </div>
  );
}
