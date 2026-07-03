"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { GalleryRow, ProjectPageData } from "./data";

gsap.registerPlugin(ScrollTrigger);

function RowMedia({ row }: { row: GalleryRow }) {
  if (row.media.kind === "video") {
    return (
      <video
        muted
        playsInline
        preload="metadata"
        data-video-inline=""
        data-video-observe=""
        loop
        autoPlay
        src={row.media.src}
        data-src-mob={row.media.srcMob}
      ></video>
    );
  }
  const img = row.media.img;
  return (
    <img
      width={img.width}
      height={img.height}
      src={img.src}
      className="attachment-kv-fullhd size-kv-fullhd"
      alt=""
      loading="lazy"
      decoding="async"
      sizes={img.sizes}
      srcSet={img.srcSet}
    />
  );
}

/**
 * Desktop: pinned curtain gallery. Rest state (CSS): row 1 full, row 2 clipped
 * to the right half, video row behind. Scrub phase 1 slides row 2 over row 1;
 * phase 2 clips both away to reveal the video row.
 */
export function ProjectGallery({ data }: { data: ProjectPageData }) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1025px)", () => {
      const rows = section.querySelectorAll<HTMLElement>(".row");
      if (rows.length < 3) return;
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${window.innerHeight * 2}`,
            pin: true,
            scrub: true,
          },
        })
        .to(rows[1], { clipPath: "inset(0% 0% 0% 0%)", ease: "none" })
        .to(rows[0], { clipPath: "inset(0% 100% 0% 0%)", ease: "none" }, "<")
        .to(rows[1], { clipPath: "inset(0% 0% 0% 100%)", ease: "none" });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="gallery">
      <div className="wrapper">
        <div className="column">
          {data.gallery.map((row) => (
            <div
              key={row.title}
              className={`row flex-c ${row.media.kind === "video" ? "video" : "image"}`}
              {...(row.media.kind === "video" ? { "data-item-mobile-video": "" } : { "data-item-image": "" })}
            >
              <div className="row-item" {...(row.media.kind === "video" ? { "data-item-video": "" } : {})}>
                <div className="item">
                  <div className="image fit-cover">
                    <RowMedia row={row} />
                  </div>
                </div>
              </div>
              <div className="row-title">
                <div className="title">
                  <p className="mulish-64">{row.title}</p>
                </div>
              </div>
              <div className="description">
                <p className="inter-20">{row.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
