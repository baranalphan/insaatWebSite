import { FadeIn, RevealText } from "@/components/site/effects";
import type { ProjectPageData } from "./data";

export function ProjectCharacteristics({ data }: { data: ProjectPageData }) {
  return (
    <section className="characteristics">
      <div className="container md-space">
        <div className="container-index" data-index="">
          004
        </div>

        <div className="container-content">
          <RevealText as="h2" className="mulish-64" text="Технічні характеристики" />
        </div>

        <div className="container-list flex-v" role="list">
          {data.characteristics.map((item) => (
            <div key={item.index} className="item" data-pin-item="" role="listitem">
              <FadeIn className="index mulish-24-regular">{item.index}</FadeIn>
              <FadeIn as="h3" className="title mulish-32" data-item-title="">
                {item.title}
              </FadeIn>
              <FadeIn className="thumb fit-cover" fade="up">
                <img
                  width={item.img.width}
                  height={item.img.height}
                  src={item.img.src}
                  className="attachment-feature size-feature"
                  alt=""
                  loading="lazy"
                  sizes={item.img.sizes}
                  decoding="async"
                  srcSet={item.img.srcSet}
                />
              </FadeIn>
              <div className="content" data-item-content="">
                {item.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
