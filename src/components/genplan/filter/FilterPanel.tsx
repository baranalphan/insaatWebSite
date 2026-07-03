"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { FlatUnit } from "../types";
import { loadFlats } from "../flat/GenplanFlat";

interface FilterPanelProps {
  open: boolean;
  onClose: () => void;
  onApply?: (ids: string[]) => void;
}

interface Range {
  min: number;
  max: number;
}

function numeric(value: string | undefined): number {
  return parseFloat((value ?? "0").replace(/\s/g, "")) || 0;
}

/** Фільтр side panel: price/area ranges + rooms checkboxes over flats.json. */
export function FilterPanel({ open, onClose }: FilterPanelProps) {
  const router = useRouter();
  const [flats, setFlats] = useState<FlatUnit[]>([]);
  const [price, setPrice] = useState<Range | null>(null);
  const [area, setArea] = useState<Range | null>(null);
  const [rooms, setRooms] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!open || flats.length) return;
    void loadFlats().then(setFlats);
  }, [open, flats.length]);

  const bounds = useMemo(() => {
    if (!flats.length) return null;
    const prices = flats.map((f) => numeric(f._price));
    const areas = flats.map((f) => numeric(f.area));
    return {
      price: { min: Math.min(...prices), max: Math.max(...prices) },
      area: { min: Math.min(...areas), max: Math.max(...areas) },
      rooms: [...new Set(flats.map((f) => f.rooms))].sort(),
    };
  }, [flats]);

  const priceRange = price ?? bounds?.price ?? { min: 0, max: 0 };
  const areaRange = area ?? bounds?.area ?? { min: 0, max: 0 };

  const results = useMemo(
    () =>
      flats.filter((f) => {
        const p = numeric(f._price);
        const a = numeric(f.area);
        if (p < priceRange.min || p > priceRange.max) return false;
        if (a < areaRange.min || a > areaRange.max) return false;
        if (rooms.size > 0 && !rooms.has(f.rooms)) return false;
        return f.sale !== "1";
      }),
    [flats, priceRange, areaRange, rooms],
  );

  if (!open) return null;

  return (
    <div className="s3d-filter-wrap active">
      <div className="s3d-filter">
        <div className="s3d-filter__top-sticky">
          <div className="s3d-filter__top">
            <div className="s3d-filter__top-results">
              <span className="s3d-filter__amount-flat">{results.length}</span> результатів
            </div>
            <button className="s3d-filter__close-wrap" type="button" aria-label="Закрити" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        {bounds && (
          <>
            <div className="s3d-filter__param">
              <div className="s3d-filter__param-title">Вартість, $</div>
              <div className="s3d-filter__range-wrapper">
                <input
                  type="range"
                  min={bounds.price.min}
                  max={bounds.price.max}
                  value={priceRange.min}
                  onChange={(e) => setPrice({ ...priceRange, min: Number(e.target.value) })}
                />
                <input
                  type="range"
                  min={bounds.price.min}
                  max={bounds.price.max}
                  value={priceRange.max}
                  onChange={(e) => setPrice({ ...priceRange, max: Number(e.target.value) })}
                />
                <div className="s3d-filter__input-wrapper">
                  <span>{priceRange.min.toLocaleString("uk-UA")}</span>–<span>{priceRange.max.toLocaleString("uk-UA")}</span>
                </div>
              </div>
            </div>

            <div className="s3d-filter__param">
              <div className="s3d-filter__param-title">Площа, м²</div>
              <div className="s3d-filter__range-wrapper">
                <input
                  type="range"
                  min={bounds.area.min}
                  max={bounds.area.max}
                  value={areaRange.min}
                  onChange={(e) => setArea({ ...areaRange, min: Number(e.target.value) })}
                />
                <input
                  type="range"
                  min={bounds.area.min}
                  max={bounds.area.max}
                  value={areaRange.max}
                  onChange={(e) => setArea({ ...areaRange, max: Number(e.target.value) })}
                />
                <div className="s3d-filter__input-wrapper">
                  <span>{areaRange.min}</span>–<span>{areaRange.max}</span>
                </div>
              </div>
            </div>

            <div className="s3d-filter__param">
              <div className="s3d-filter__param-title">Кімнат</div>
              <div className="s3d-filter__checkboxes-wrapper">
                {bounds.rooms.map((r) => (
                  <div key={r} className="Checkbox">
                    <input
                      className="Checkbox__input"
                      type="checkbox"
                      id={`rooms-${r}`}
                      checked={rooms.has(r)}
                      onChange={() =>
                        setRooms((prev) => {
                          const next = new Set(prev);
                          if (next.has(r)) next.delete(r);
                          else next.add(r);
                          return next;
                        })
                      }
                    />
                    <label className="Checkbox__label" htmlFor={`rooms-${r}`}>
                      {r}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="s3d-filter__results">
          {results.map((f) => (
            <button
              key={f.id}
              type="button"
              className="s3d-card js-s3d-card"
              onClick={() => {
                onClose();
                router.push(`/genplan?type=flat&id=${f.id}`);
              }}
            >
              <div className="s3d-card__header">
                <div className="s3d-card__status s3d-card__image-info">
                  {f.sale === "2" ? "Перепродаж від власника" : "Доступно"}
                </div>
              </div>
              <div className="s3d-card__middle">
                <div className="s3d-card__image">
                  <img src={f.img} alt="" loading="lazy" />
                </div>
                <div className="s3d-card__info-wrapper">
                  <div className="s3d-card__info-label-wrapper">
                    <div className="s3d-card__info-label">Котедж №{f.number}</div>
                    <div className="s3d-card__info-label">{f.area} м²</div>
                    <div className="s3d-card__info-label">
                      {f.price} {String(f.currencySymbol ?? "$")}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
