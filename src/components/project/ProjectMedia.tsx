"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { usePopups } from "@/components/site/Popups";
import { FadeIn } from "@/components/site/effects";
import { RichReveal } from "./RichReveal";
import type { MediaTab, ProjectPageData } from "./data";

function MediaSlider({ tab, active }: { tab: MediaTab; active: boolean }) {
  const { openVideo } = usePopups();
  const paginationRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <div className={`slider${active ? " active" : ""}`} data-slider={tab.id}>
      <Swiper
        className="swiper"
        modules={[Navigation, Pagination]}
        slidesPerView="auto"
        pagination={{ clickable: true }}
        navigation={{}}
        onBeforeInit={(swiper) => {
          const pagination = swiper.params.pagination;
          if (pagination && typeof pagination !== "boolean") pagination.el = paginationRef.current;
          const navigation = swiper.params.navigation;
          if (navigation && typeof navigation !== "boolean") {
            navigation.prevEl = prevRef.current;
            navigation.nextEl = nextRef.current;
          }
        }}
      >
        {tab.images?.map((img) => (
          <SwiperSlide key={img.src}>
            <div className="item fit-cover">
              <img
                width={img.width}
                height={img.height}
                src={img.src}
                className="attachment-project size-project"
                alt=""
                loading="lazy"
                decoding="async"
                sizes={img.sizes}
                srcSet={img.srcSet}
              />
            </div>
          </SwiperSlide>
        ))}
        {tab.videos?.map((video) => (
          <SwiperSlide key={video.hash}>
            <div className="item fit-cover">
              <button
                className="flex-c fit-cover video"
                data-video-button=""
                data-hash={video.hash}
                data-type={video.type}
                aria-label="Play video"
                onClick={() => openVideo(video.hash, video.type)}
              >
                <img src={`https://i.ytimg.com/vi/${video.hash}/mqdefault.jpg`} alt="" aria-hidden="true" />
              </button>
            </div>
          </SwiperSlide>
        ))}
        <div slot="container-end" className="slider-navigation">
          <div ref={paginationRef} className="swiper-pagination"></div>
          <div className="navs inter-16-semi">
            <button ref={prevRef} className="cta cta-prev" data-nav="">
              <div className="icon"></div>
              <div className="cta-text">
                <div className="t">
                  <span>Назад</span>
                </div>
              </div>
            </button>
            <button ref={nextRef} className="cta cta-next" data-nav="">
              <div className="cta-text">
                <div className="t">
                  <span>Вперед</span>
                </div>
              </div>
              <div className="icon"></div>
            </button>
          </div>
        </div>
      </Swiper>
    </div>
  );
}

export function ProjectMedia({ data }: { data: ProjectPageData }) {
  const [activeTab, setActiveTab] = useState(data.mediaTabs[0].id);

  return (
    <section className="media">
      <div className="container md-space">
        <div className="container-index">004</div>
        <div className="container-content">
          <RichReveal className="mulish-64-light">{data.mediaTitle}</RichReveal>
        </div>
        <FadeIn className="container-tabs" data-media-tabs="">
          {data.mediaTabs.map((tab) => (
            <label key={tab.id} className="tab mulish-24" aria-label={tab.label}>
              <input
                type="radio"
                name="media"
                value={tab.id}
                checked={activeTab === tab.id}
                onChange={() => setActiveTab(tab.id)}
              />
              {tab.label}
            </label>
          ))}
        </FadeIn>
        <FadeIn className="container-sliders" fade="up">
          {data.mediaTabs.map((tab) => (
            <MediaSlider key={tab.id} tab={tab} active={activeTab === tab.id} />
          ))}
        </FadeIn>
      </div>
    </section>
  );
}
