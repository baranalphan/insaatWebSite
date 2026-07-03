"use client";

import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import { Btn } from "@/components/site/Btn";
import { FadeIn, useFadeIn } from "@/components/site/effects";

interface LocationItem {
  id: string;
  title: string;
  address: string;
  tel: string;
  telHref: string;
  slideTitle: string;
  slideImg: {
    width: number;
    height: number;
    src: string;
    srcSet: string;
    sizes: string;
  };
  href: string;
  pin: { left: string; top: string };
}

const LOCATIONS: LocationItem[] = [
  {
    id: "ChIJuSOkOSrnOkcRU5kAseY8qk8",
    title: "LAGOM Villa Kent",
    address: "Hrushevskoho Caddesi, 57, Sokilnyky, Lviv Oblastı, Ukrayna, 81130",
    tel: "093 60 60 300",
    telHref: "tel:0936060300",
    slideTitle: "LAGOM",
    slideImg: {
      width: 360,
      height: 203,
      src: "/images/2026_03_zagalnyj-na-pivnich-360x203.webp",
      srcSet:
        "/images/2026_03_zagalnyj-na-pivnich-360x203.webp 360w, /images/2026_03_zagalnyj-na-pivnich-300x169.webp 300w, /images/2026_03_zagalnyj-na-pivnich-436x245.webp 436w, /images/2026_03_zagalnyj-na-pivnich-240x135.webp 240w, /images/2026_03_zagalnyj-na-pivnich.webp 576w",
      sizes: "(max-width: 375px) 60vw, (max-width: 780px) 50vw, (max-width: 1024px) calc(100vw - 116px), 360px",
    },
    href: "/lagom",
    pin: { left: "55%", top: "35%" },
  },
  {
    id: "ChIJPby1NDbmOkcRgQRSjb6gKPU",
    title: "UNIQUE Rezidans Kompleksi",
    address: "Ivana Franka Caddesi, 49, Sokilnyky, Lviv Oblastı, Ukrayna, 81130",
    tel: "073 70 60 300",
    telHref: "tel:0737060300",
    slideTitle: "UNIQUE",
    slideImg: {
      width: 360,
      height: 240,
      src: "/images/2026_03_genplan-1-360x240.webp",
      srcSet:
        "/images/2026_03_genplan-1-360x240.webp 360w, /images/2026_03_genplan-1-300x200.webp 300w, /images/2026_03_genplan-1-436x291.webp 436w, /images/2026_03_genplan-1-240x160.webp 240w, /images/2026_03_genplan-1.webp 576w",
      sizes: "(max-width: 375px) 60vw, (max-width: 780px) 50vw, (max-width: 1024px) calc(100vw - 116px), 360px",
    },
    href: "/lagom",
    pin: { left: "60%", top: "40%" },
  },
];

/** Per-letter spans matching the original `.btn .btn-text` markup inside the location cards. */
function OnMapText({ label }: { label: string }) {
  let letterIndex = 0;
  return (
    <div className="btn-text">
      {[...label].map((ch, i) => {
        if (ch === " ") {
          letterIndex++;
          return <span key={i}>&nbsp;</span>;
        }
        return (
          <span key={i} style={{ "--i": letterIndex++ } as CSSProperties}>
            {ch}
          </span>
        );
      })}
    </div>
  );
}

/**
 * Replacement for the original Google Maps canvas (custom cream style, API key
 * required). Static map image + absolutely-positioned pins; clicking a location
 * card swaps the matching pin to its active variant.
 */
// TODO(map-asset): add /images/map-static.webp (custom-styled map screenshot of Sokilnyky).
function MapCanvas({ activeId }: { activeId: string | null }) {
  return (
    <div
      className="map-static"
      style={{ position: "absolute", inset: 0, background: "url(/images/map-static.webp) center / cover no-repeat" }}
    >
      {LOCATIONS.map((loc) => (
        <img
          key={loc.id}
          src={activeId === loc.id ? "/images/theme_icons_map-pin-active.svg" : "/images/theme_icons_map-pin.svg"}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            left: loc.pin.left,
            top: loc.pin.top,
            width: 40,
            transform: "translate(-50%, -100%)",
          }}
        />
      ))}
    </div>
  );
}

export function HomeLocations() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const swiperRef = useRef<SwiperClass | null>(null);
  const sliderElRef = useRef<HTMLElement | null>(null);
  useFadeIn(sliderElRef);

  const selectLocation = (id: string, index: number) => {
    setActiveId(id);
    swiperRef.current?.slideTo(index);
  };

  return (
    <section className="locations">
      <div className="container">
        <div className="map-wrapper">
          <FadeIn className="container-map" data-google-map="" data-speed="0.8">
            <MapCanvas activeId={activeId} />
          </FadeIn>
        </div>
        <FadeIn className="container-index">004</FadeIn>
        <FadeIn className="container-locations flex-v" data-speed="1.1">
          <h3 className="mulish-32">Lokasyonlarımız</h3>
          <div className="scroller" data-scroller-wrapper="">
            <div className="flex-v" data-scroller-content="">
              {LOCATIONS.map((loc, index) => (
                <button
                  key={loc.id}
                  className={`location btn-hover${activeId === loc.id ? " active" : ""}`}
                  data-map-card=""
                  data-map-toggle=""
                  data-id={loc.id}
                  aria-label="Haritada görüntüle"
                  onClick={() => selectLocation(loc.id, index)}
                >
                  <p className="title inter-20-semi">{loc.title}</p>
                  <div className="contacts flex-v">
                    <div className="flex-h">
                      <div className="icon icon-location"></div>
                      <p>{loc.address}</p>
                    </div>
                    <div className="flex-h">
                      <div className="icon icon-tell"></div>
                      <a href={loc.telHref}>{loc.tel}</a>
                    </div>
                  </div>
                  <span className="btn on-map inter-16-semi" aria-hidden="true">
                    <OnMapText label="Haritada görüntüle" />
                    <div className="icon icon-arrow"></div>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </FadeIn>
        <Swiper
          className={activeId ? "active" : ""}
          modules={[Navigation]}
          slidesPerView={1}
          navigation={{ prevEl: ".locations .swiper-nav.prev", nextEl: ".locations .swiper-nav.next" }}
          data-locations-slider=""
          data-fade="up"
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            sliderElRef.current = swiper.el;
          }}
          onSlideChange={(swiper) => {
            const loc = LOCATIONS[swiper.activeIndex];
            if (loc) setActiveId(loc.id);
          }}
        >
          <button slot="container-start" className="swiper-nav prev" aria-label="Önceki slayt"></button>
          {LOCATIONS.map((loc) => (
            <SwiperSlide key={loc.id}>
              <div className="swiper-slide-item fit-cover">
                <img
                  width={loc.slideImg.width}
                  height={loc.slideImg.height}
                  src={loc.slideImg.src}
                  className="attachment-project-sm size-project-sm"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  sizes={loc.slideImg.sizes}
                  srcSet={loc.slideImg.srcSet}
                />
              </div>
              <div className="swiper-slide-info flex-v">
                <p className="mulish-32">{loc.slideTitle}</p>
                <Btn label="Detaylar" href={loc.href} className="cta" />
              </div>
            </SwiperSlide>
          ))}
          <button slot="container-end" className="swiper-nav next" aria-label="Sonraki slayt"></button>
        </Swiper>
      </div>
    </section>
  );
}
