"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useUnclip } from "@/components/site/effects";
import type { ProjectPageData } from "./data";

gsap.registerPlugin(ScrollTrigger);

/** Full-bleed inline <video> band: unclip reveal + in-view autoplay. */
export function ProjectVideo({ data }: { data: ProjectPageData }) {
  const unclipRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  useUnclip(unclipRef);

  useLayoutEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const trigger = ScrollTrigger.create({
      trigger: video,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => {
        if (self.isActive) void video.play().catch(() => undefined);
        else video.pause();
      },
    });
    return () => trigger.kill();
  }, []);

  return (
    <section className="video">
      <div ref={unclipRef} data-unclip="">
        <div className="wrapper fit-cover" data-speed="0.9">
          <video
            ref={videoRef}
            muted
            playsInline
            preload="metadata"
            data-video-inline=""
            loop
            src={data.videoSrc}
            data-src-mob={data.videoSrcMob}
          ></video>
        </div>
      </div>
    </section>
  );
}
