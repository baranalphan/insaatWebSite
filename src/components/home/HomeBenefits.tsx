"use client";

import { useRef } from "react";
import { usePopups } from "@/components/site/Popups";
import { FadeIn, RevealText, useUnclip } from "@/components/site/effects";

interface StatSlide {
  active: boolean;
  title: string;
  count: string;
  sub: string;
  description: string;
  desktopSrcSet: string;
  desktopSizes: string;
  mobileSrcSet: string;
  mobileSizes: string;
  src: string;
}

const STAT_SLIDES: StatSlide[] = [
  {
    active: false,
    title: "Projeler",
    count: "33",
    sub: "bin m²",
    description: "16 bin m²'den fazlası tamamlandı, geri kalanı inşaat aşamasında.",
    desktopSrcSet:
      "/images/2025_12_kidmom_1-360x676.webp 360w, /images/2025_12_kidmom_1-160x300.webp 160w, /images/2025_12_kidmom_1-545x1024.webp 545w, /images/2025_12_kidmom_1-436x819.webp 436w, /images/2025_12_kidmom_1-240x451.webp 240w, /images/2025_12_kidmom_1-437x820.webp 437w, /images/2025_12_kidmom_1-300x563.webp 300w, /images/2025_12_kidmom_1-213x400.webp 213w, /images/2025_12_kidmom_1-426x800.webp 426w, /images/2025_12_kidmom_1.webp 639w",
    desktopSizes: "(max-width: 1440px) 300px, 426px",
    mobileSrcSet:
      "/images/2025_12_kidmom_mob.webp 318w, /images/2025_12_kidmom_mob-300x201.webp 300w, /images/2025_12_kidmom_mob-240x161.webp 240w",
    mobileSizes: "360px",
    src: "/images/2025_12_kidmom_1-360x676.webp",
  },
  {
    active: true,
    title: "Evler",
    count: "140",
    sub: "teslim",
    description: "240'tan fazlası ise inşaat ve tasarım aşamasında.",
    desktopSrcSet:
      "/images/2025_12_green_teritory_2-360x676.webp 360w, /images/2025_12_green_teritory_2-160x300.webp 160w, /images/2025_12_green_teritory_2-545x1024.webp 545w, /images/2025_12_green_teritory_2-436x819.webp 436w, /images/2025_12_green_teritory_2-240x451.webp 240w, /images/2025_12_green_teritory_2-437x820.webp 437w, /images/2025_12_green_teritory_2-300x563.webp 300w, /images/2025_12_green_teritory_2-213x400.webp 213w, /images/2025_12_green_teritory_2-426x800.webp 426w, /images/2025_12_green_teritory_2.webp 639w",
    desktopSizes: "(max-width: 1440px) 300px, 426px",
    mobileSrcSet:
      "/images/2025_12_green_teritory__mob.webp 318w, /images/2025_12_green_teritory__mob-300x201.webp 300w, /images/2025_12_green_teritory__mob-240x161.webp 240w",
    mobileSizes: "360px",
    src: "/images/2025_12_green_teritory_2-360x676.webp",
  },
  {
    active: false,
    title: "Sosyal Alanlar",
    count: "2,2",
    sub: "hektar ",
    description: "Özel sahil şeridi, yürüyüş yolları, çocuk, spor ve dinlenme alanları.",
    desktopSrcSet:
      "/images/2025_12_playyard_3-360x676.webp 360w, /images/2025_12_playyard_3-160x300.webp 160w, /images/2025_12_playyard_3-545x1024.webp 545w, /images/2025_12_playyard_3-436x819.webp 436w, /images/2025_12_playyard_3-240x451.webp 240w, /images/2025_12_playyard_3-437x820.webp 437w, /images/2025_12_playyard_3-300x563.webp 300w, /images/2025_12_playyard_3-213x400.webp 213w, /images/2025_12_playyard_3-426x800.webp 426w, /images/2025_12_playyard_3.webp 639w",
    desktopSizes: "(max-width: 1440px) 300px, 426px",
    mobileSrcSet:
      "/images/2025_12_playyard_mob.webp 321w, /images/2025_12_playyard_mob-300x199.webp 300w, /images/2025_12_playyard_mob-240x159.webp 240w",
    mobileSizes: "360px",
    src: "/images/2025_12_playyard_3-360x676.webp",
  },
];

export function HomeBenefits() {
  const { openVideo } = usePopups();
  const collageImgRef = useRef<HTMLImageElement>(null);
  const videoButtonRef = useRef<HTMLButtonElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  useUnclip(collageImgRef);
  useUnclip(videoButtonRef);
  useUnclip(bottomRef);

  return (
    <section className="benefits">
      <div className="container top">
        <FadeIn className="container-index">002</FadeIn>
        <div className="container-kivi fit-cover" data-speed="0.9">
          <img
            ref={collageImgRef}
            width={436}
            height={436}
            src="/images/2026_03_untitled-design-436x436.webp"
            className="attachment-benefit size-benefit"
            alt=""
            loading="lazy"
            decoding="async"
            data-unclip='{"max-width": "1024px"}'
            data-speed="clamp(0.9)"
            sizes="(max-width: 1024px) 320px, 436px"
            srcSet="/images/2026_03_untitled-design-436x436.webp 436w, /images/2026_03_untitled-design-300x300.webp 300w, /images/2026_03_untitled-design-150x150.webp 150w, /images/2026_03_untitled-design-240x240.webp 240w, /images/2026_03_untitled-design-360x360.webp 360w, /images/2026_03_untitled-design-400x400.webp 400w, /images/2026_03_untitled-design.webp 720w"
          />
        </div>
        <div className="container-text" data-speed="1.1">
          <RevealText as="h2" className="mulish-80" text="Doğayla iç içe, yaşam için iyi düşünülmüş alanlar" />
        </div>
        <button
          ref={videoButtonRef}
          className="container-video flex-c fit-cover"
          data-video-button=""
          aria-label="Play video"
          data-hash="B66npSCbgQ4"
          data-type="video"
          data-speed="1"
          data-unclip='{"max-width": "1024px"}'
          onClick={() => openVideo("B66npSCbgQ4", "video")}
        >
          <img
            width={436}
            height={259}
            src="/images/2026_03_04-_3_-436x259.webp"
            className="attachment-benefit size-benefit"
            alt=""
            loading="lazy"
            data-speed="clamp(0.9)"
            sizes="(max-width: 375px) 100px, (max-width: 768px) 200px, (max-width: 1440px) 300px, 436px"
            decoding="async"
            srcSet="/images/2026_03_04-_3_-436x259.webp 436w, /images/2026_03_04-_3_-300x178.webp 300w, /images/2026_03_04-_3_-1024x608.webp 1024w, /images/2026_03_04-_3_-768x456.webp 768w, /images/2026_03_04-_3_-1536x911.webp 1536w, /images/2026_03_04-_3_-1350x801.webp 1350w, /images/2026_03_04-_3_-720x427.webp 720w, /images/2026_03_04-_3_-240x142.webp 240w, /images/2026_03_04-_3_-1080x641.webp 1080w, /images/2026_03_04-_3_-760x451.webp 760w, /images/2026_03_04-_3_-360x214.webp 360w, /images/2026_03_04-_3_-600x356.webp 600w, /images/2026_03_04-_3_.webp 1820w"
          />
        </button>
      </div>

      <div ref={bottomRef} className="container bottom" data-speed="0.6" data-unclip='{"max-width": "1024px"}'>
        <div className="swiper">
          <div className="swiper-wrapper">
            {STAT_SLIDES.map((slide) => (
              <div key={slide.title} className={`swiper-slide${slide.active ? " active" : ""}`}>
                <div className="swiper-item">
                  <div className="swiper-item-info">
                    <p className="title mulish-24-regular">{slide.title}</p>
                    <p className="count mulish-100">
                      {slide.count} <sub>{slide.sub}</sub>
                    </p>
                    <div className="line"></div>
                    <p className="description inter-20" data-description="">
                      {slide.description}
                    </p>
                  </div>
                  <div className="swiper-item-thumb">
                    <div className="image">
                      <div className="image-wrapper fit-cover">
                        <picture>
                          <source media="(min-width: 1025px)" srcSet={slide.desktopSrcSet} sizes={slide.desktopSizes} />
                          <source media="(max-width: 1024px)" srcSet={slide.mobileSrcSet} sizes={slide.mobileSizes} />
                          <img src={slide.src} alt={slide.title} loading="lazy" decoding="async" />
                        </picture>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
