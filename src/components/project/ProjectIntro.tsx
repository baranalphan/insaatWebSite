"use client";

import { Btn } from "@/components/site/Btn";
import { usePopups } from "@/components/site/Popups";
import type { ProjectPageData } from "./data";

const HERO_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2560 2503'%3E%3C/svg%3E";

export function ProjectIntro({ data }: { data: ProjectPageData }) {
  const { openCallback } = usePopups();

  return (
    <section className="intro">
      <div className="container md-space">
        <div className="container-index">001</div>
        <div className="container-logo">{data.introLogo}</div>
        <div className="container-arrow"></div>
        <div className="container-content flex-v">
          <h1 className="mulish-32-regular">{data.introTitle}</h1>
          <Btn
            label="Отримати консультацію"
            href="#callback"
            onClick={(e) => {
              e.preventDefault();
              openCallback();
            }}
          />
        </div>
        <div className="container-location">
          <div className="location">
            <div className="icon icon-location"></div>
            <p className="inter-20">м. Львів, Бічна вул. Стрийська (с. Сокільники)</p>
          </div>
        </div>
        <div className="hero flex-c" data-hero="">
          <div className="hero-overlay"></div>
          <picture>
            <source media="(max-width: 1024px)" srcSet={HERO_PLACEHOLDER} />
            <source
              media="(min-width: 1025px)"
              srcSet={data.heroDesktopSrcSet}
              sizes="(min-width: 2560px) 2560px, (min-width: 1920px) 1920px, 100vw"
            />
            <img
              src={HERO_PLACEHOLDER}
              alt={data.heroAlt}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              width={2560}
              height={2503}
              style={{ width: "100%", height: "auto", aspectRatio: "2560 / 2503", objectFit: "cover" }}
            />
          </picture>
        </div>
      </div>
    </section>
  );
}
