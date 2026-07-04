"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { FlatProperty, FlatUnit } from "../types";
import {
  FLYBY1_OUTSIDE_OVERLAYS,
  FLYBY1_INSIDE_OVERLAYS,
  FLYBY2_OUTSIDE_OVERLAYS,
} from "../fragments";
import flatData from "./flat-data.json";
import {
  TILE_ICONS,
  STATUS_INFO_SVG,
  NAV_PHONE_INNER,
  NAV_PDF_INNER,
  NAV_3D_INNER,
  UP_ARROW_INNER,
  SCROLL_DOWN_INNER,
} from "./villa-icons";

let flatsCache: Promise<FlatUnit[]> | null = null;
export function loadFlats(): Promise<FlatUnit[]> {
  flatsCache ??= fetch("/genplan/data/flats.json").then((r) => r.json() as Promise<FlatUnit[]>);
  return flatsCache;
}

const LEVEL_LABELS: Record<string, string> = {
  "1": "1. Kat",
  "2": "2. Kat",
  "3": "Çatı Katı",
};

/** original semantics: 0 продано / 1 доступно / 2 резерв */
const SALE_LABELS: Record<string, string> = {
  "0": "Satıldı",
  "1": "Satışta",
  "2": "Rezerve",
};

/** settings.json assotiated_flat_builds_with_flybys */
const BUILD_FLYBY: Record<
  string,
  { flyby: string; side: string; frameSet: string; overlays: Record<string, string> }
> = {
  "1": { flyby: "1", side: "inside", frameSet: "1_inside", overlays: FLYBY1_INSIDE_OVERLAYS },
  "6": { flyby: "1", side: "outside", frameSet: "1_outside", overlays: FLYBY1_OUTSIDE_OVERLAYS },
  "8": { flyby: "2", side: "outside", frameSet: "2_outside", overlays: FLYBY2_OUTSIDE_OVERLAYS },
};

/**
 * Static "on the 3D model" strip: control-point-1 polygons of the unit's flyby,
 * all `.active`, the current unit additionally `.active-flat` (original behavior).
 */
function villaFlybySvg(overlays: Record<string, string>, unitId: string): string {
  const wrap = overlays["1"] ?? "";
  const start = wrap.indexOf("<svg");
  const end = wrap.lastIndexOf("</svg>");
  if (start < 0 || end < 0) return "";
  let svg = wrap.slice(start, end + 6);
  svg = svg.replace(/preserveAspectRatio="[^"]*"/, 'preserveAspectRatio="xMidYMid slice"');
  svg = svg.replace(/<polygon\b[^>]*>/g, (tag) => {
    const id = tag.match(/data-id="(\d+)"/)?.[1];
    return tag.replace(/class="([^"]*)"/, (_m, cls: string) => {
      const base = cls.replace("polygon__filter-deselect", "polygon__filter-select");
      return `class="${base} active${id === unitId ? " active-flat" : ""}"`;
    });
  });
  return svg;
}

function propsOf(unit: FlatUnit): FlatProperty[] {
  const p = unit.properties;
  if (!p) return [];
  const list = Array.isArray(p) ? p : Object.values(p);
  return list.sort((a, b) => Number(a.properties_order ?? 0) - Number(b.properties_order ?? 0));
}

const SOCIALS = [
  { name: "Telegram", href: "https://t.me/lagom_development", d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8-1.55 7.3c-.12.52-.42.65-.85.4l-2.36-1.74-1.14 1.1c-.13.12-.23.23-.48.23l.17-2.43 4.42-4c.19-.17-.04-.26-.3-.1l-5.46 3.45-2.35-.74c-.51-.16-.52-.51.11-.75l9.19-3.54c.43-.16.8.1.6.82z" },
  { name: "YouTube", href: "https://www.youtube.com/@lagomdevelopment", d: "M21.58 7.19a2.51 2.51 0 0 0-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42A2.51 2.51 0 0 0 2.42 7.19 26.2 26.2 0 0 0 2 12a26.2 26.2 0 0 0 .42 4.81 2.51 2.51 0 0 0 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42a2.51 2.51 0 0 0 1.77-1.77A26.2 26.2 0 0 0 22 12a26.2 26.2 0 0 0-.42-4.81zM10 15V9l5.2 3z" },
  { name: "Facebook", href: "https://www.facebook.com/lagomdevelopment", d: "M13.5 21v-7h2.4l.36-2.8H13.5V9.4c0-.81.22-1.36 1.38-1.36h1.48V5.55A19.8 19.8 0 0 0 14.21 5.4c-2.13 0-3.59 1.3-3.59 3.7v2.1H8.2V14h2.42v7z" },
  { name: "Instagram", href: "https://www.instagram.com/lagom_development/", d: "M12 7.38A4.62 4.62 0 1 0 16.62 12 4.62 4.62 0 0 0 12 7.38zm0 7.62A3 3 0 1 1 15 12a3 3 0 0 1-3 3zm5.88-7.8a1.08 1.08 0 1 1-1.08-1.08 1.08 1.08 0 0 1 1.08 1.08zM12 4.62c2.4 0 2.69.01 3.64.05a4.99 4.99 0 0 1 1.67.31 2.98 2.98 0 0 1 1.71 1.71 4.99 4.99 0 0 1 .31 1.67c.04.95.05 1.24.05 3.64s-.01 2.69-.05 3.64a4.99 4.99 0 0 1-.31 1.67 2.98 2.98 0 0 1-1.71 1.71 4.99 4.99 0 0 1-1.67.31c-.95.04-1.24.05-3.64.05s-2.69-.01-3.64-.05a4.99 4.99 0 0 1-1.67-.31 2.98 2.98 0 0 1-1.71-1.71 4.99 4.99 0 0 1-.31-1.67c-.04-.95-.05-1.24-.05-3.64s.01-2.69.05-3.64a4.99 4.99 0 0 1 .31-1.67 2.98 2.98 0 0 1 1.71-1.71 4.99 4.99 0 0 1 1.67-.31c.95-.04 1.24-.05 3.64-.05z" },
];

/** House detail view (`?type=flat&id=N`) — s3d-villa sheet over the flyby. */
export function GenplanFlat({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const controlPoint = searchParams.get("controlPoint");

  const [flats, setFlats] = useState<FlatUnit[] | null>(null);
  const [level, setLevel] = useState("1");
  const [plan2d, setPlan2d] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [sent, setSent] = useState(false);
  const [favAdded, setFavAdded] = useState(false);
  const [navVisible, setNavVisible] = useState(false);
  const villaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void loadFlats().then(setFlats);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLevel("1");
    setPlan2d(false);
    setFaqOpen(null);
    villaRef.current?.scrollTo(0, 0);
  }, [id]);

  const unit = useMemo(() => flats?.find((f) => f.id === id) ?? null, [flats, id]);
  const levels = useMemo(() => Object.keys(unit?.flat_levels_photo ?? { "1": null }), [unit]);
  const rooms = useMemo(
    () => (unit ? propsOf(unit).filter((p) => (p.property_level ?? "1") === level) : []),
    [unit, level],
  );
  const flybyCfg = BUILD_FLYBY[String(unit?.build ?? "6")] ?? BUILD_FLYBY["6"];
  const flybyHtml = useMemo(
    () =>
      unit
        ? `<img src="/genplan/flyby/${flybyCfg.frameSet}/1.jpg" alt=""/>` +
          villaFlybySvg(flybyCfg.overlays, unit.id)
        : "",
    [unit, flybyCfg],
  );

  if (!unit) {
    return <div className="s3d-villa s3d-villa--loading" />;
  }

  const levelPhoto = unit.flat_levels_photo?.[level];
  const has2d = Boolean(levelPhoto?.with);
  const planImg = plan2d && levelPhoto?.with
    ? String(levelPhoto.with)
    : (levelPhoto?.without ?? unit.images?.without?.["3d"] ?? unit.img);
  const levelTotal = rooms.reduce((sum, r) => sum + (parseFloat(r.property_flat ?? "0") || 0), 0);

  const statTiles: Array<{ value: string; label: string; icon: string }> = [
    { value: String(unit.bathrooms ?? ""), label: "Banyo", icon: TILE_ICONS.banyo },
    { value: String(unit.rooms ?? ""), label: "Oda", icon: TILE_ICONS.oda },
    { value: String(unit.area_land ?? ""), label: "Arsa Alanı", icon: TILE_ICONS.arsa },
  ];
  if (unit.navis && unit.navis !== "0")
    statTiles.push({ value: String(unit.navis), label: "Sundurma", icon: TILE_ICONS.sundurma });
  if (unit.second_light && unit.second_light !== "0")
    statTiles.push({ value: String(unit.second_light), label: "Galeri Boşluğu", icon: TILE_ICONS.galeri });

  const onScroll = () => {
    const el = villaRef.current;
    if (!el) return;
    setNavVisible(el.scrollTop > el.clientHeight * 0.6);
  };
  const scrollToSheet = () =>
    villaRef.current?.scrollTo({ top: villaRef.current.clientHeight, behavior: "smooth" });
  const scrollToTop = () => villaRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  const goto3dModel = () => {
    const cp = controlPoint ? `&controlPoint=${controlPoint}` : "";
    router.push(
      `/genplan?type=flyby&flyby=${flybyCfg.flyby}&side=${flybyCfg.side}${cp}&markedFlat=${unit.id}`,
    );
  };

  return (
    <div className="s3d-villa" ref={villaRef} onScroll={onScroll}>
      <div className={`s3d-villa__navigation${navVisible ? " visible" : ""}`}>
        <button type="button" className="ButtonIconLeft active ButtonIconLeft--secondary" data-open-form="">
          <svg
            className="ButtonIconLeft__icon--no-paints"
            viewBox="0 0 24 24"
            fill="none"
            dangerouslySetInnerHTML={{ __html: NAV_PHONE_INNER }}
          />
          <span>Geri Arama</span>
        </button>
        <button type="button" className="ButtonIconLeft js-s3d__create-pdf" onClick={() => window.print()}>
          <svg
            className="ButtonIconLeft__icon--no-paints"
            viewBox="0 0 24 24"
            fill="none"
            dangerouslySetInnerHTML={{ __html: NAV_PDF_INNER }}
          />
          <span>PDF</span>
        </button>
        <button
          type="button"
          className={`ButtonIconLeft js-s3d-add__favourite${favAdded ? " active" : ""}`}
          onClick={() => setFavAdded((v) => !v)}
        >
          <svg className="ButtonIconLeft__icon--no-paints"><use href="#icon-Compare" /></svg>
          <span>{favAdded ? "Karşılaştırmaya eklendi" : "Karşılaştırma"}</span>
        </button>
        <button type="button" className="ButtonIconLeft" onClick={goto3dModel}>
          <svg
            className="ButtonIconLeft__icon--no-paints"
            viewBox="0 0 24 24"
            fill="none"
            dangerouslySetInnerHTML={{ __html: NAV_3D_INNER }}
          />
          <span>3D Modelde</span>
        </button>
      </div>

      <div className="s3d-villa-hero">
        <div className="s3d-villa-hero__img-wrapper">
          <img className="s3d-villa-hero__img" src={unit.img_big ?? unit.img} alt="" />
        </div>
        <div className="s3d-villa-hero__info">
          <h1 className="s3d-villa-hero__title">{unit.title ?? "LAGOM"}</h1>
          <span className="s3d-villa-hero__line" />
          <p
            className="s3d-villa-hero__description"
            dangerouslySetInnerHTML={{ __html: unit.description ?? "" }}
          />
        </div>
      </div>

      <div className="s3d-villa__container">
        <div className="s3d-villa__floor">
          <a className="s3d-villa__floor-scroll-wrap" onClick={scrollToSheet} role="button">
            <div className="s3d-villa__floor-scroll-title">Kaydır</div>
            <div className="s3d-villa__floor-scroll-svg-wrap">
              <svg viewBox="0 0 24 24" fill="none" dangerouslySetInnerHTML={{ __html: SCROLL_DOWN_INNER }} />
            </div>
          </a>

          <div className="s3d-villa__floor__title-wrap">
            <div className="s3d-villa__floor__title-wrap__line" />
            <div className="s3d-villa__floor__title">PLANLAR</div>
            <div className="s3d-villa__floor__title-wrap__line" />
          </div>

          <div className="s3d-villa__floor-inner">
            <div className="s3d-villa__floor-details">
              <div className="s3d-villa__floor-details__info-wrapper">
                <div className="s3d-villa__floor-details__info-img-wrapper">
                  <img className="s3d-villa__floor-details__info-img" src={unit.img_big ?? unit.img} alt="" />
                </div>
                <div className="s3d-villa__floor-details__info">
                  <div className="s3d-villa__floor-details__info-status-wrap" data-sale={unit.sale}>
                    <span className={`s3d-villa__floor-details__info-status__title status-${unit.sale}`}>
                      {SALE_LABELS[unit.sale] ?? SALE_LABELS["1"]}
                    </span>
                    <div
                      className="s3d-villa__floor-details__info-status__svg"
                      dangerouslySetInnerHTML={{ __html: STATUS_INFO_SVG }}
                    />
                  </div>
                  {unit.deferral_period ? (
                    <div className="s3d-villa__floor-details__info-prices-wrap">
                      {String(unit.deferral_period)}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="s3d-villa__floor-details__info-list">
                {statTiles.map((tile) => (
                  <div key={tile.label} className="s3d-villa__floor-details__info-list-item">
                    <div className="s3d-villa__floor-details__info-list-item__svg-group">
                      <div className="s3d-villa__floor-details__info-list-item__value">{tile.value}</div>
                      <span dangerouslySetInnerHTML={{ __html: tile.icon }} />
                    </div>
                    <div className="s3d-villa__floor-details__info-list-item__title">{tile.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="s3d-villa__floor-explication-screen">
              <div className="s3d-villa__floor-explication-screen-buttons--floor">
                {levels.map((lv) => (
                  <button
                    key={lv}
                    type="button"
                    className={`ButtonWithoutIcon${level === lv ? " active" : ""}`}
                    onClick={() => setLevel(lv)}
                  >
                    {LEVEL_LABELS[lv] ?? `${lv}. Kat`}
                  </button>
                ))}
              </div>
              <div className="s3d-villa__floor-explication-screen-slider swiper-container">
                <div className="swiper-wrapper">
                  <div className="swiper-slide">
                    <div className="s3d-villa__floor-explication-screen-slide">
                      {planImg && <img src={String(planImg)} alt={`Plan — ${LEVEL_LABELS[level] ?? level}`} />}
                    </div>
                  </div>
                </div>
                {has2d && (
                  <div className="s3d-villa__floor-explication-screen-buttons--slider">
                    <div className="s3d-villa__floor-explication-screen-buttons--planning3d">
                      <button
                        type="button"
                        className={`ButtonWithoutIcon${!plan2d ? " active" : ""}`}
                        onClick={() => setPlan2d(false)}
                      >
                        3D Plan
                      </button>
                      <button
                        type="button"
                        className={`ButtonWithoutIcon${plan2d ? " active" : ""}`}
                        onClick={() => setPlan2d(true)}
                      >
                        2D Plan
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="s3d-villa__floor-explication-screen-table">
                  <div className="s3d-villa__floor-explication-screen-table-inner">
                    <div className="s3d-villa__floor-explication-screen-table__title">
                      {LEVEL_LABELS[level] ?? `${level}. Kat`}
                    </div>
                    <div className="s3d-villa__floor-explication-screen-info">
                      <div className="s3d-villa__floor-explication-screen-info-row">
                        <div className="s3d-villa__floor-explication-screen-info-row-title bold">No:</div>
                        <div className="s3d-villa__floor-explication-screen-info-row-blank" />
                        <div className="s3d-villa__floor-explication-screen-info-row-value bold">{unit.number}</div>
                      </div>
                      <div className="s3d-villa__floor-explication-screen-info-row">
                        <div className="s3d-villa__floor-explication-screen-info-row-title bold">Toplam Alan:</div>
                        <div className="s3d-villa__floor-explication-screen-info-row-blank" />
                        <div className="s3d-villa__floor-explication-screen-info-row-value bold">{unit.area} m²</div>
                      </div>
                      {rooms.map((room) => (
                        <div key={room.property_id} className="s3d-villa__floor-explication-screen-info-row">
                          <div className="s3d-villa__floor-explication-screen-info-row-title">{room.property_name}</div>
                          <div className="s3d-villa__floor-explication-screen-info-row-blank" />
                          <div className="s3d-villa__floor-explication-screen-info-row-value">{room.property_flat} m²</div>
                        </div>
                      ))}
                      <div className="s3d-villa__floor-explication-screen-info-row">
                        <div className="s3d-villa__floor-explication-screen-info-row-title bold">Kat Alanı</div>
                        <div className="s3d-villa__floor-explication-screen-info-row-blank" />
                        <div className="s3d-villa__floor-explication-screen-info-row-value bold">
                          {levelTotal.toFixed(2)} m²
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          <div className="s3d-villa__contact" data-contact-section="">
            <div className="s3d-villa__contact__content__column">
              <div className="s3d-villa__contact__form__title">Sorularınız mı var?</div>
              <p className="s3d-villa__contact__form__note">
                Mülk ve satın alma koşulları hakkında ek bilgi almak için formu doldurun.
              </p>
              {sent ? (
                <p className="s3d-villa__contact__form__success">Talebiniz başarıyla gönderildi</p>
              ) : (
                <form
                  data-home-contact=""
                  autoComplete="off"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                  }}
                >
                  <div className="form-field form-field-input">
                    <label>Adınız:*</label>
                    <input type="text" name="name" placeholder="İsim" required />
                  </div>
                  <div className="form-field form-field-input">
                    <label>Telefonunuz:*</label>
                    <input type="tel" name="phone" placeholder="+90" required />
                  </div>
                  <div className="form-field form-field-input">
                    <label>Yorumunuz</label>
                    <textarea name="comment" placeholder="Mesajınız" rows={3} />
                  </div>
                  <button className="ButtonWithoutIcon" type="submit">
                    Bilgi Alın
                  </button>
                </form>
              )}
            </div>
            <div className="s3d-villa__contact__content__column">
              <div className="s3d-villa__contact-location-intro-item__title">İletişim</div>
              <a className="ButtonWithoutIcon" href="tel:+380936060300">
                +38 093 60 60 300
              </a>
              <div className="s3d-villa__contact-socials">
                {SOCIALS.map((s) => (
                  <a key={s.name} href={s.href} target="_blank" rel="noreferrer" aria-label={s.name}>
                    <svg viewBox="0 0 24 24" width="20" height="20"><path d={s.d} /></svg>
                  </a>
                ))}
              </div>
              <div className="s3d-villa__contact-office">
                <div className="s3d-villa__contact-office__caption">Satış Ofisi</div>
                <div className="s3d-villa__contact-office__address">
                  Sokilnyky köyü, Hrushevskoho Cad., Lviv, Lviv Oblastı, 81130
                </div>
              </div>
              <button className="ButtonWithoutIcon js-s3d-flat__3d-tour" type="button" data-href="">
                Haritada Aç
              </button>
            </div>
          </div>

          <div className="s3d-villa__faq">
            {flatData.faq.map((item, i) => (
              <div key={item.q} className={`s3d-villa__faq-card${faqOpen === i ? " active" : ""}`}>
                <div className="s3d-villa__faq-card-inner">
                  <button
                    type="button"
                    className="s3d-villa__faq-card__question-wrap"
                    onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  >
                    <div className="s3d-villa__faq-card__question">{item.q}</div>
                    <div className="s3d-villa__faq-card__question-icon">{faqOpen === i ? "–" : "+"}</div>
                  </button>
                  {faqOpen === i && <div className="s3d-villa__faq-card__answer">{item.a}</div>}
                </div>
              </div>
            ))}
          </div>

          <div className="s3d-villa__faq-cta">
            <button className="ButtonWithoutIcon s3d-villa__faq-cta-btn" type="button" data-open-form="">
              Sorularım var
            </button>
          </div>
        </div>
      </div>

      <div className="s3d-villa__flyby-wrapper">
        <div className="s3d-villa__flyby" dangerouslySetInnerHTML={{ __html: flybyHtml }} />
      </div>

      <div className="s3d-villa__up-arrow" onClick={scrollToTop} role="button">
        <svg viewBox="0 0 24 24" fill="none" dangerouslySetInnerHTML={{ __html: UP_ARROW_INNER }} />
        <span>YUKARI</span>
      </div>
    </div>
  );
}
