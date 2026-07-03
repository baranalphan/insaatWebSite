"use client";

import { useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Pagination } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { Btn } from "@/components/site/Btn";
import { RevealText } from "@/components/site/effects";

gsap.registerPlugin(ScrollTrigger);

interface ProjectSlide {
  base: string;
  width: number;
  height: number;
  variants: string[];
}

interface ProjectData {
  num: string;
  title: ReactNode;
  tagline: string;
  from: ReactNode;
  area: ReactNode;
  description: ReactNode;
  href: string;
  slides: ProjectSlide[];
}

/** WP `uploads/2026/03/<base>-<WxH>.webp` srcset, rewritten to /images. "" = the full-size 1920w original. */
function slideSrcSet(base: string, variants: string[]): string {
  return variants
    .map((v) => (v === "" ? `/images/2026_03_${base}.webp 1920w` : `/images/2026_03_${base}-${v}.webp ${v.split("x")[0]}w`))
    .join(", ");
}

const SLIDE_SIZES = "(max-width: 480px) 240px, (max-width: 1024px) 40vw, 760px";

const VARIANTS_512 = ["768x512", "300x200", "1024x683", "1536x1024", "1350x900", "720x480", "436x291", "240x160", "1080x720", "760x507", "360x240", "600x400", ""];
const VARIANTS_432 = ["768x432", "300x169", "1024x576", "1536x864", "1350x759", "720x405", "436x245", "240x135", "1080x608", "760x428", "360x203", "600x338", ""];

const PROJECTS: ProjectData[] = [
  {
    num: "01",
    title: "Котеджне містечко LAGOM",
    tagline: "Простір, де панує гармонія",
    from: (
      <>
        від <sup>1370</sup> $/м
        <strong>
          <sup>2</sup>
        </strong>
      </>
    ),
    area: (
      <>
        Площа будинку від<strong> 132 </strong>м
        <strong>
          <sup>2</sup>
        </strong>
      </>
    ),
    description: (
      <>
        Розтермінування до<strong> 2 років</strong>
      </>
    ),
    href: "/lagom",
    slides: [
      { base: "ph_romacayman-65", width: 768, height: 512, variants: VARIANTS_512 },
      { base: "ph_romacayman-102", width: 768, height: 512, variants: VARIANTS_512 },
      { base: "4a5a7839", width: 768, height: 512, variants: VARIANTS_512 },
      { base: "at__3646", width: 768, height: 512, variants: VARIANTS_512 },
      {
        base: "ph_romacayman-133",
        width: 768,
        height: 512,
        variants: ["768x512", "300x200", "1024x682", "1536x1023", "1350x899", "720x480", "436x290", "240x160", "1080x719", "760x506", "360x240", "600x400", ""],
      },
    ],
  },
  {
    num: "02",
    title: (
      <>
        Резиденції <br /> UNIQUE
      </>
    ),
    tagline: "Простір, де говорить тиша",
    from: (
      <>
        від <sup>2400</sup> $/м
        <strong>
          <sup>2</sup>
        </strong>
      </>
    ),
    area: (
      <>
        Площа будинку від <strong>301 </strong>м
        <strong>
          <sup>2</sup>
        </strong>
      </>
    ),
    description: (
      <>
        Розтермінування до <strong>2 років</strong>
      </>
    ),
    href: "/unique",
    slides: [
      { base: "lagom_0072", width: 768, height: 432, variants: VARIANTS_432 },
      { base: "typ-a-№-2-4-6-8-11-13-siryj-.jpg-lagom_0016", width: 768, height: 432, variants: VARIANTS_432 },
      {
        base: "zagalnyj-№6-vhidna-grupa",
        width: 768,
        height: 530,
        variants: ["768x530", "300x207", "1024x707", "1536x1061", "1350x932", "720x497", "436x301", "240x166", "1080x746", "760x525", "360x249", "579x400", ""],
      },
      { base: "zagalnyj-№1", width: 768, height: 432, variants: VARIANTS_432 },
      { base: "genplan", width: 768, height: 512, variants: VARIANTS_512 },
    ],
  },
];

function ProjectCard({ project }: { project: ProjectData }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperClass | null>(null);
  const advanceRef = useRef<gsap.core.Tween | null>(null);
  const cardActiveRef = useRef(false);

  useLayoutEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      const advance = gsap.to(
        {},
        {
          duration: 5.5,
          ease: "none",
          paused: true,
          onComplete: () => swiperRef.current?.slideNext(),
        },
      );
      advanceRef.current = advance;

      ScrollTrigger.create({
        trigger: card,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          cardActiveRef.current = self.isActive;
          if (self.isActive) advance.play();
          else advance.pause();
        },
      });

      mm.add("(min-width: 1025px)", () => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: card,
              start: "50% 50%",
              end: () => `+=${card.clientHeight}`,
              scrub: true,
              pin: true,
              pinSpacing: false,
            },
          })
          .to(card, { scale: 0.5, y: "-=25vh", autoAlpha: 0 }, "scale");
      });
    }, card);
    return () => {
      advanceRef.current = null;
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <div ref={cardRef} className="project" data-project="">
      <div className="container">
        <div className="project-info flex-v">
          <div className="project-info-top flex-v">
            <p className="from">{project.from}</p>
            <p className="area">{project.area}</p>
            <p className="description">{project.description}</p>
          </div>

          <div className="project-info-bottom flex-v">
            <div className="title flex-v">
              <p className="num">
                <span className="mulish-24">{project.num}</span>/02
              </p>
              <h3 className="mulish-50">{project.title}</h3>
              <p>{project.tagline}</p>
            </div>

            <div className="location flex-h">
              <div className="icon icon-location"></div>
              <p className="inter-16-semi">м. Львів, бічна вул. Стрийська (с. Сокільники)</p>
            </div>

            <div className="navs">
              <Btn label="Детальніше" href={project.href} className="info" />
              <Btn label="На карті" variant="border" className="map" href="/contacts" />
            </div>
          </div>
        </div>
        <div className="project-slider">
          <Swiper
            modules={[Mousewheel, Pagination]}
            slidesPerView={1}
            loop
            mousewheel={{ forceToAxis: true }}
            pagination={{ clickable: true }}
            onBeforeInit={(swiper) => {
              const pagination = swiper.params.pagination;
              if (pagination && typeof pagination !== "boolean" && paginationRef.current) {
                pagination.el = paginationRef.current;
              }
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={() => {
              const advance = advanceRef.current;
              if (!advance) return;
              advance.restart();
              if (!cardActiveRef.current) advance.pause();
            }}
          >
            {project.slides.map((slide) => (
              <SwiperSlide key={slide.base} className="fit-cover">
                <img
                  width={slide.width}
                  height={slide.height}
                  src={`/images/2026_03_${slide.base}-${slide.variants[0]}.webp`}
                  className="attachment-medium_large size-medium_large"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  sizes={SLIDE_SIZES}
                  srcSet={slideSrcSet(slide.base, slide.variants)}
                />
              </SwiperSlide>
            ))}
            <div slot="container-end" ref={paginationRef} className="swiper-pagination"></div>
            <div slot="container-end" className="swiper-baner flex-v">
              <span className="count mulish-50-extra">8</span>
              <p>
                будинків
                <br />
                доступно
              </p>
            </div>
          </Swiper>
        </div>
      </div>
    </div>
  );
}

export function HomeProjects() {
  return (
    <section className="projects">
      <div className="container">
        <div className="container-index">003</div>

        <div className="container-text">
          <RevealText as="h2" className="mulish-64" text="Наші проєкти" />
        </div>

        <div className="container-grid flex-v">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.num} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
