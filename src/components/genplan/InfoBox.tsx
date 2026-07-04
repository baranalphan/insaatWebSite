"use client";

import type { FlatUnit } from "./types";

export interface InfoBoxState {
  unit: FlatUnit;
  x: number;
  y: number;
}

const STATUS_TEXT: Record<string, string> = {
  "1": "Satışta",
  "2": "Rezerve",
};

/**
 * Flyby hover tooltip (`.s3d-infoBox`) — shown for available (sale=1) and
 * reserved (sale=2) units only; all styling comes from the mirrored theme CSS,
 * status colors via the `[data-sale]` attribute selectors.
 */
export function InfoBox({ state }: { state: InfoBoxState | null }) {
  const unit = state?.unit;
  return (
    <div
      className={`js-s3d-infoBox s3d-infoBox${state ? " s3d-show" : ""}`}
      data-s3d-type="infoBox"
      style={
        state
          ? { opacity: 1, top: state.y, left: state.x, pointerEvents: "none" }
          : { opacity: 0, pointerEvents: "none" }
      }
    >
      {unit && (
        <div className="s3d-infoBox__flat">
          <div className="s3d-infoBox__flat__alert-header">
            <div>
              <div
                className="s3d-infoBox__flat__alert s3d-infoBox__flat__alert--with-icon"
                data-sale={unit.sale}
              >
                {STATUS_TEXT[unit.sale] ?? ""}
                <svg className="s3d-infoBox__flat__alert__status-icon">
                  <use href="#icon-Info" />
                </svg>
              </div>
              {unit.fund ? (
                <div className="s3d-infoBox__flat__alert__badge">
                  <svg className="s3d-card__badge-icon">
                    <use href="#icon-Construction" />
                  </svg>
                  {String(unit.fund)}
                </div>
              ) : null}
            </div>
          </div>
          <div className="s3d-infoBox__flat__alert__middle">
            <div className="s3d-infoBox__flat__alert__middle__text-block">
              <div>Villa No: {unit.number}</div>
              <button
                type="button"
                className="ButtonWithoutIcon show-on-tablet ButtonWithoutIcon--secondary"
              >
                Evi İncele
              </button>
            </div>
          </div>
          <div className="s3d-infoBox__flat__image-wrapper">
            <div className="s3d-infoBox__image">
              <img src={unit.img_big ?? unit.img} alt="" />
            </div>
          </div>
          <div className="s3d-infoBox__flat__alert__middle" />
          <div className="s3d-infoBox__flat-bottom">
            <div className="s3d-infoBox__info">
              <div className="s3d-infoBox__flat__wrapper-label">
                {unit.deferral_period ? (
                  <div className="s3d-infoBox__flat__label">
                    <span>{String(unit.deferral_period)}</span>
                  </div>
                ) : null}
                <div className="s3d-infoBox__flat__label">
                  Konut Alanı: <span className="super-text">{unit.area}</span> m²
                </div>
                <div className="s3d-infoBox__flat__label">
                  Plan Tipi: <span className="super-text">{unit.type}</span>
                </div>
                <div className="s3d-infoBox__flat__label">
                  Arsa Alanı: <span className="super-text">{unit.area_land}</span> ar
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
