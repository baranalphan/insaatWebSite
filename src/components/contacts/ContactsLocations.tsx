"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { ContactForm, usePopups } from "@/components/site/Popups";

interface ContactLocation {
  id: string;
  title: string;
  address: string;
  tel: string;
  telHref: string;
  pin: { left: string; top: string };
}

const LOCATIONS: ContactLocation[] = [
  {
    id: "ChIJP4Ew5jbmOkcRd9qHk4uWpEg",
    title: "LAGOM Villa Kent",
    address: "Sichovykh Striltsiv Caddesi, 34, Sokilnyky, Lviv Oblastı, Ukrayna, 81130",
    tel: "093 60 60 300",
    telHref: "tel:0936060300",
    pin: { left: "55%", top: "40%" },
  },
  {
    id: "ChIJF-trEwDnOkcRRtMPXHdR6pY",
    title: "UNIQUE Rezidans Kompleksi",
    address: "Sichovykh Striltsiv Caddesi, 251, Sokilnyky, Lviv Oblastı, Ukrayna, 81130",
    tel: "073 70 60 300",
    telHref: "tel:0737060300",
    pin: { left: "45%", top: "55%" },
  },
];

/** Per-letter spans matching the original `.btn .btn-text` markup. */
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

export function ContactsLocations() {
  const { openSuccess } = usePopups();
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <section
      className="locations"
      data-pin='{"min-width": "1024px", "start": "100% 90%", "slowScroll": 0.75, "inertia": true}'
    >
      <div className="container md-space">
        <div className="container-index">004</div>
        <div className="container-content">
          <h1 className="mulish-64">İletişim</h1>
        </div>
        <div className="container-locations flex-v">
          <div className="scroller flex-v" data-scroller-wrapper="">
            <div className="flex-v" data-scroller-content="">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc.id}
                  className={`location btn-hover${activeId === loc.id ? " active" : ""}`}
                  data-map-card=""
                  data-map-toggle=""
                  data-id={loc.id}
                  aria-label="Haritada Gör"
                  onClick={() => setActiveId(loc.id)}
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
                    <OnMapText label="Haritada Gör" />
                    <div className="icon icon-arrow"></div>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Static replacement for the original Google Map (API key required). */}
        {/* TODO(map-asset): add /images/map-static-contacts.webp */}
        <div className="container-map" data-google-map="" data-scroll-to-map="1" style={{ position: "relative" }}>
          <div
            className="map-static"
            style={{
              position: "absolute",
              inset: 0,
              background: "url(/images/map-static-contacts.webp) center / cover no-repeat",
            }}
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
        </div>
        <div className="container-form flex-v">
          <h2 className="mulish-50">Daha fazla bilgi edinmek ister misiniz?</h2>
          <div className="custom-form" data-cf7="">
            <ContactForm onSuccess={openSuccess} />
          </div>
          <p className="form-description">İletişim bilgilerinizi bırakın, bilgi almak için sizinle iletişime geçelim.</p>
          <div className="form-managers flex-c">
            <div className="items flex-h">
              <div className="item fit-cover"></div>
              <div className="item fit-cover"></div>
            </div>
            <p className="inter-16-semi"></p>
          </div>
        </div>
      </div>
    </section>
  );
}
