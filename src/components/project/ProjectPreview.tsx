import type { ProjectPageData } from "./data";

const PREVIEW_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 880 1720'%3E%3C/svg%3E";

export function ProjectPreview({ data }: { data: ProjectPageData }) {
  return (
    <section className="preview">
      <div className="section-bg" data-hero-mobile="">
        <div className="section-bg--curtain section-bg--curtain-l"></div>
        <div className="section-bg--curtain section-bg--curtain-r"></div>
        <div className="section-bg--img fit-cover">
          <picture>
            <source media="(min-width: 1025px)" srcSet={PREVIEW_PLACEHOLDER} />
            <source
              media="(max-width: 1024px)"
              srcSet={data.previewMobileSrcSet}
              sizes="(max-width: 480px) 100vw, 100vw"
            />
            <img
              src={PREVIEW_PLACEHOLDER}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              alt={data.previewTitle}
              width={880}
              height={1720}
              style={{ width: "100%", height: "auto", aspectRatio: "880 / 1720", objectFit: "cover", display: "block" }}
            />
          </picture>
        </div>
      </div>

      <div className="container md-space">
        <div className="container-content flex-v">
          <div className="location">
            <div className="icon icon-location"></div>
            <p>м. Львів, Бічна вул. Стрийська (с. Сокільники)</p>
          </div>
          <h2 className="location-title mulish-80">{data.previewTitle}</h2>
        </div>
      </div>
    </section>
  );
}
