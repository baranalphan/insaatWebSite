"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { FadeIn, RevealText } from "@/components/site/effects";
import { INFRA_SLIDES } from "./media-data";

/**
 * "Міська інфраструктура" — identical on /lagom and /unique. The original
 * renders a Google Map behind the slider; we use a static map background.
 */
// TODO(map-asset): add /images/map-static.webp (custom-styled map screenshot).
export function ProjectInfrastructure() {
  return (
    <section className="infrastructure">
      <div className="container md-space">
        <div className="container-index" data-speed="1.1">
          001
        </div>
        <div className="container-content" data-speed="1.1">
          <RevealText as="h2" className="mulish-80" text="Şehir Altyapısı" />
        </div>
        <FadeIn className="container-map" fade="up" data-google-map="">
          <div
            className="map-static"
            style={{ position: "absolute", inset: 0, background: "url(/images/map-static.webp) center / cover no-repeat" }}
          />
        </FadeIn>
        <FadeIn className="container-slider">
          <Swiper className="swiper" slidesPerView="auto" data-loc-slider="">
            {INFRA_SLIDES.map((slide, i) => (
              <SwiperSlide key={`${slide.name}-${i}`}>
                <div className="slide flex-v">
                  <div className="time inter-20">
                    <sup>{slide.time} </sup>
                    {slide.unit}
                  </div>
                  <div className="slide-item fit-cover">
                    <img
                      width={slide.img.width}
                      height={slide.img.height}
                      src={slide.img.src}
                      className="attachment-project-sm size-project-sm"
                      alt=""
                      loading="lazy"
                      decoding="async"
                      sizes={slide.img.sizes}
                      srcSet={slide.img.srcSet}
                    />
                  </div>
                  <div className="bottom flex-h">
                    <p className="name mulish-24">{slide.name}</p>
                    <div className="marker"></div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </FadeIn>
      </div>
    </section>
  );
}
