"use client";

import { useRef, useState } from "react";
import type { ReactNode } from "react";
import { usePopups } from "@/components/site/Popups";
import { RevealText, useFadeIn } from "@/components/site/effects";

interface AccordionItem {
  title: string;
  content: ReactNode;
}

const ITEMS: AccordionItem[] = [
  {
    title: "Çevre Düzenleme & Hizmetler",
    content: (
      <p>
        Yönetim Şirketi &quot;DİM LAGOM&quot;:
        <br />
        <br />
        • Villa kentin estetik dış görünümünün korunmasını sağlar
        <br />
        <br />
        • Sokak temizliği ve çöp ayrıştırma hizmetlerini yürütür
        <br />
        <br />
        • Sokak aydınlatmalarının çalışmasını kontrol eder ve arızaları hızla giderir
        <br />
        <br />
        • Rutin bakım ve onarımları gerçekleştirir
        <br />
        <br />
        • Sakinlerin konforu ve kaliteli vakit geçirmesi için çocuk oyun ve spor alanlarının bakımını yapar.
      </p>
    ),
  },
  {
    title: "Güvenlik",
    content: (
      <p>
        Kontrollü geçiş sistemi, video gözetim ve yedek güç sisteminin düzenli kontrolleri sakinlerin huzurunu garanti eder.
      </p>
    ),
  },
  {
    title: "Peyzaj ve Bahçe Bakımı",
    content: (
      <p>
        Şunları içerir:
        <br />
        <br />
        • Bitki ve ağaç bakımı
        <br />
        <br />
        • Çimlerin düzenli biçilmesi ve bakımı
        <br />
        <br />
        • Kar temizleme hizmetleri.
      </p>
    ),
  },
];

export function HomeAccordion() {
  const { openVideo } = usePopups();
  const [expanded, setExpanded] = useState(0);
  const videoButtonRef = useRef<HTMLButtonElement>(null);
  useFadeIn(videoButtonRef);

  return (
    <section className="accordion">
      <div className="container md-space">
        <div className="container-text" data-speed="1.1">
          <RevealText as="h2" className="mulish-64" text="Yönetim Şirketi" />
        </div>
        <button
          ref={videoButtonRef}
          className="container-video flex-c fit-cover"
          data-video-button=""
          data-fade=""
          aria-label="Play video"
          data-hash="Uhbdmc-MkNU"
          data-type="shorts"
          onClick={() => openVideo("Uhbdmc-MkNU", "shorts")}
        >
          <img
            width={600}
            height={400}
            src="/images/2026_03_4a5a7889-600x400.webp"
            className="attachment-feature size-feature"
            alt=""
            loading="lazy"
            decoding="async"
            data-speed="0.9"
            sizes="(max-width:640px) 100vw, 600px"
            srcSet="/images/2026_03_4a5a7889-600x400.webp 600w, /images/2026_03_4a5a7889-300x200.webp 300w, /images/2026_03_4a5a7889-1024x683.webp 1024w, /images/2026_03_4a5a7889-768x512.webp 768w, /images/2026_03_4a5a7889-720x480.webp 720w, /images/2026_03_4a5a7889-436x291.webp 436w, /images/2026_03_4a5a7889-240x160.webp 240w, /images/2026_03_4a5a7889-760x507.webp 760w, /images/2026_03_4a5a7889-360x240.webp 360w, /images/2026_03_4a5a7889.webp 1080w"
          />
        </button>

        <ul className="container-list flex-v" data-accordion-list="" data-autoplay="true">
          {ITEMS.map((item, i) => (
            <li key={item.title} className={`item${expanded === i ? " expanded" : ""}`}>
              <button
                className="item-button"
                id={`item-heading-${i + 1}`}
                aria-expanded={expanded === i}
                aria-controls={`item-panel-${i + 1}`}
                aria-label={item.title}
                onClick={() => setExpanded(i)}
              >
                <div className="item-index inter-20" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="item-title mulish-24">{item.title}</div>
              </button>

              <div className="item-collapsed" id={`item-panel-${i + 1}`} role="region" aria-labelledby={`item-heading-${i + 1}`}>
                <div className="item--wrapper">{item.content}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
