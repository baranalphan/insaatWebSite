"use client";

import { useEffect, useMemo, useState } from "react";
import type { FlatProperty, FlatUnit } from "../types";
import flatData from "./flat-data.json";

let flatsCache: Promise<FlatUnit[]> | null = null;
export function loadFlats(): Promise<FlatUnit[]> {
  flatsCache ??= fetch("/genplan/data/flats.json").then((r) => r.json() as Promise<FlatUnit[]>);
  return flatsCache;
}

const LEVEL_LABELS: Record<string, string> = {
  "1": "1-й поверх",
  "2": "2-й поверх",
  "3": "Мансарда",
};

const SALE_LABELS: Record<string, string> = {
  "0": "Доступно",
  "1": "Продано",
  "2": "Перепродаж від власника",
};

function propsOf(unit: FlatUnit): FlatProperty[] {
  const p = unit.properties;
  if (!p) return [];
  const list = Array.isArray(p) ? p : Object.values(p);
  return list.sort((a, b) => Number(a.properties_order ?? 0) - Number(b.properties_order ?? 0));
}

/** House detail view (`?type=flat&id=N`) — s3d-villa sheet over the viewer. */
export function GenplanFlat({ id }: { id: string }) {
  const [flats, setFlats] = useState<FlatUnit[] | null>(null);
  const [level, setLevel] = useState("1");
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    void loadFlats().then(setFlats);
  }, []);

  const unit = useMemo(() => flats?.find((f) => f.id === id) ?? null, [flats, id]);
  const levels = useMemo(() => Object.keys(unit?.flat_levels_photo ?? { "1": null }), [unit]);
  const rooms = useMemo(
    () => (unit ? propsOf(unit).filter((p) => (p.property_level ?? "1") === level) : []),
    [unit, level],
  );

  if (!unit) {
    return <div className="s3d-villa s3d-villa--loading" />;
  }

  const levelTotal = rooms.reduce((sum, r) => sum + (parseFloat(r.property_flat ?? "0") || 0), 0);
  const planImg = unit.flat_levels_photo?.[level]?.without ?? unit.images?.without?.["3d"] ?? unit.img;

  return (
    <div className="s3d-villa">
      <div className="s3d-villa__container">
        <div className="s3d-villa__floor">
          <div className="s3d-villa__floor-scroll-wrap">
            <div className="s3d-villa__floor-scroll-title">{unit.title ?? "LAGOM"}</div>
            <div
              className="s3d-villa__floor-scroll-subtitle"
              dangerouslySetInnerHTML={{ __html: unit.description ?? "" }}
            />
            <div className="s3d-villa__floor-scroll-hint">Гортай ↓</div>
          </div>

          <div className="s3d-villa__floor__title-wrap">
            <div className="s3d-villa__floor__title-wrap__line" />
            <div className="s3d-villa__floor__title">Котедж №{unit.number}</div>
            <div className="s3d-villa__floor__title-wrap__line" />
          </div>

          <div className="s3d-villa__floor-inner">
            <div className="s3d-villa__floor-details">
              <div className="s3d-villa__floor-details__info-wrapper">
                <div className="s3d-villa__floor-details__info-img-wrapper">
                  <img className="s3d-villa__floor-details__info-img" src={unit.img_big ?? unit.img} alt="" />
                </div>
                <div className="s3d-villa__floor-details__info">
                  <div className="s3d-villa__floor-details__info-status-wrap">
                    <div className={`s3d-villa__floor-details__info-status__title status-${unit.sale}`}>
                      {SALE_LABELS[unit.sale] ?? SALE_LABELS["0"]}
                    </div>
                  </div>
                  <div className="s3d-villa__floor-details__info-prices-wrap">
                    <div className="s3d-villa__floor-details__info-price">
                      {unit.price} {String(unit.currencySymbol ?? "$")}
                    </div>
                    <div className="s3d-villa__floor-details__info-price-m2">
                      {unit.price_m2} $/м²
                    </div>
                  </div>
                  <div className="s3d-villa__floor-details__info-list">
                    <div className="s3d-villa__floor-details__info-list-item">
                      <div className="s3d-villa__floor-details__info-list-item__value">{unit.bathrooms}</div>
                      <div className="s3d-villa__floor-details__info-list-item__title">Ванних кімнат</div>
                    </div>
                    <div className="s3d-villa__floor-details__info-list-item">
                      <div className="s3d-villa__floor-details__info-list-item__value">{unit.rooms}</div>
                      <div className="s3d-villa__floor-details__info-list-item__title">Кімнат</div>
                    </div>
                    <div className="s3d-villa__floor-details__info-list-item">
                      <div className="s3d-villa__floor-details__info-list-item__value">{unit.area_land}</div>
                      <div className="s3d-villa__floor-details__info-list-item__title">Площа ділянки</div>
                    </div>
                  </div>
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
                      {LEVEL_LABELS[lv] ?? `${lv}-й поверх`}
                    </button>
                  ))}
                </div>
                <div className="s3d-villa__floor-explication-screen-slider">
                  <div className="s3d-villa__floor-explication-screen-slide">
                    {planImg && <img src={planImg} alt={`План — ${LEVEL_LABELS[level] ?? level}`} />}
                  </div>
                </div>
                <div className="s3d-villa__floor-explication-screen-table">
                  <div className="s3d-villa__floor-explication-screen-table-inner">
                    <div className="s3d-villa__floor-explication-screen-table__title">
                      {LEVEL_LABELS[level] ?? `${level}-й поверх`}
                    </div>
                    <div className="s3d-villa__floor-explication-screen-info">
                      {rooms.map((room) => (
                        <div key={room.property_id} className="s3d-villa__floor-explication-screen-info-row">
                          <div className="s3d-villa__floor-explication-screen-info-row-title">{room.property_name}</div>
                          <div className="s3d-villa__floor-explication-screen-info-row-blank" />
                          <div className="s3d-villa__floor-explication-screen-info-row-value">{room.property_flat} м²</div>
                        </div>
                      ))}
                      <div className="s3d-villa__floor-explication-screen-info-row">
                        <div className="s3d-villa__floor-explication-screen-info-row-title bold">Площа поверху</div>
                        <div className="s3d-villa__floor-explication-screen-info-row-blank" />
                        <div className="s3d-villa__floor-explication-screen-info-row-value bold">
                          {levelTotal.toFixed(2)} м²
                        </div>
                      </div>
                      <div className="s3d-villa__floor-explication-screen-info-row">
                        <div className="s3d-villa__floor-explication-screen-info-row-title bold">Загальна площа</div>
                        <div className="s3d-villa__floor-explication-screen-info-row-blank" />
                        <div className="s3d-villa__floor-explication-screen-info-row-value bold">{unit.area} м²</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="s3d-villa__contact">
            <div className="s3d-villa__contact__content__column">
              <div className="s3d-villa__contact__form__title">Залишились питання?</div>
              {sent ? (
                <p className="s3d-villa__contact__form__success">Запит успішно надісланий</p>
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
                    <input type="text" name="name" placeholder="Ваше ім'я:*" required />
                  </div>
                  <div className="form-field form-field-input">
                    <input type="tel" name="phone" placeholder="Ваш телефон:*" required />
                  </div>
                  <button className="ButtonWithoutIcon" type="submit">
                    Отримати консультацію
                  </button>
                </form>
              )}
            </div>
            <div className="s3d-villa__contact__content__column">
              <div className="s3d-villa__contact-location-intro-item__title">Контакти</div>
              <a className="ButtonWithoutIcon" href="tel:+380936060300">
                +38 093 60 60 300
              </a>
              <button className="ButtonWithoutIcon js-s3d-flat__3d-tour" type="button" data-href="">
                Відкрити на карті
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
        </div>
      </div>
    </div>
  );
}
