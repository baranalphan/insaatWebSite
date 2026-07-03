"use client";

import { ContactForm, usePopups } from "@/components/site/Popups";
import { FadeIn, RevealText } from "@/components/site/effects";

export function HomeCtaForm() {
  const { openSuccess } = usePopups();

  return (
    <section className="cta-form" data-pin='{"min-width": "1024px", "start": "100% 90%", "slowScroll": 0.5, "inertia": true}'>
      <div className="container md-space">
        <div className="container-index">006</div>
        <div className="container-content">
          <div className="container-image fit-cover">
            <img
              width={404}
              height={400}
              src="/images/2026_01_nature_elements_graphic-404x400.webp"
              className="attachment-feature size-feature"
              alt=""
              loading="lazy"
              decoding="async"
              sizes="(max-width:1024px) 100vw, 50vw"
              srcSet="/images/2026_01_nature_elements_graphic-404x400.webp 404w, /images/2026_01_nature_elements_graphic-150x150.webp 150w, /images/2026_01_nature_elements_graphic-300x297.webp 300w, /images/2026_01_nature_elements_graphic-768x760.webp 768w, /images/2026_01_nature_elements_graphic-1024x1013.webp 1024w, /images/2026_01_nature_elements_graphic-1350x1336.webp 1350w, /images/2026_01_nature_elements_graphic-720x713.webp 720w, /images/2026_01_nature_elements_graphic-436x432.webp 436w, /images/2026_01_nature_elements_graphic-240x238.webp 240w, /images/2026_01_nature_elements_graphic-829x820.webp 829w, /images/2026_01_nature_elements_graphic-760x752.webp 760w, /images/2026_01_nature_elements_graphic-360x356.webp 360w, /images/2026_01_nature_elements_graphic-426x422.webp 426w, /images/2026_01_nature_elements_graphic-640x633.webp 640w, /images/2026_01_nature_elements_graphic.webp 1455w"
            />
          </div>
        </div>
        <div className="container-form flex-v">
          <RevealText text="Daha fazla bilgi edinmek ister misiniz?" as="h2" className="mulish-64" />
          <FadeIn className="custom-form" fade="up" data-cf7="">
            <ContactForm onSuccess={openSuccess} />
          </FadeIn>
          <p className="form-description">
            İletişim bilgilerinizi bırakın, danışmanlık için sizinle iletişime geçelim.
          </p>
        </div>
      </div>
    </section>
  );
}
