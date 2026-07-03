"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  SPRITE,
  MARKER_PATTERNS,
  LOADER,
  HEADER_LEFT,
  HEADER_RIGHT,
  CTR,
  MENU,
  HELPER,
  POPUP_FLYBY,
  FORM_POPUP,
  MASTERPLAN_OVERLAYS,
  FLYBY1_OUTSIDE_OVERLAYS,
} from "./fragments";
import { FrameViewer } from "./FrameViewer";
import type { FrameViewerHandle } from "./FrameViewer";
import { GenplanFlat } from "./flat/GenplanFlat";
import { FilterPanel } from "./filter/FilterPanel";

const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m16!1m10!1m3!1d24513.279878576155!2d23.9967534!3d49.7799323!2m1!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x473addb1aaa5b1eb%3A0xa0c14dc40ea69867!2sLagom%20Development!5e0!3m2!1suk!2sua!4v1750325729919!5m2!1suk!2sua";

/** Compass: settings from the original app config. */
const COMPASS = {
  masterplan: { north: 100, start: 35 },
  flyby: { north: 89, start: 40 },
};

const CHROME = { __html: SPRITE + MARKER_PATTERNS };
const HEADER = { __html: HEADER_LEFT + HEADER_RIGHT };
const CTR_HTML = { __html: CTR };
const MENU_HTML = { __html: MENU };
const HELPER_HTML = { __html: HELPER };
const POPUP_FLYBY_HTML = { __html: POPUP_FLYBY };
const FORM_HTML = { __html: FORM_POPUP };
const LOADER_HTML = { __html: LOADER };

export function GenplanApp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const flatId = searchParams.get("id");
  const view: "genplan" | "flyby" | "flat" =
    type === "flyby" ? "flyby" : type === "flat" && flatId ? "flat" : "genplan";

  const [dark, setDark] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [controlFrame, setControlFrame] = useState(31);
  const [menuOpen, setMenuOpen] = useState(false);
  const [helperOpen, setHelperOpen] = useState(false);
  const [helperStep, setHelperStep] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [flybyUnavailable, setFlybyUnavailable] = useState(false);

  const viewerRef = useRef<FrameViewerHandle>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const frameSet = view === "flyby" ? "1_outside" : dark ? "masterplan_dark" : "masterplan";

  /* switching frame sets restarts the preload — show the loader again */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(false);
  }, [frameSet]);

  /* --- sync injected chrome: preloader %, spin-nav progress bar --- */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.querySelectorAll(".fs-preloader-amount").forEach((el) => {
      el.textContent = `${progress}%`;
    });
    root.querySelectorAll<HTMLElement>("[data-flyby-visual-load-element]").forEach((el) => {
      el.style.transform = `scaleX(${progress / 100})`;
    });
    root.querySelectorAll(".SpinNav").forEach((el) => el.classList.toggle("inLoad", !ready));
  }, [progress, ready]);

  /* --- compass rotation (header dial + bottom ring) --- */
  const onFrame = useCallback(
    (frame: number) => {
      const root = rootRef.current;
      if (!root) return;
      const cfg = view === "flyby" ? COMPASS.flyby : COMPASS.masterplan;
      const deg = cfg.start + ((frame - cfg.north) / 120) * 360;
      root.querySelectorAll<SVGElement>(".js-s3d__compass svg").forEach((el) => {
        el.style.transform = `rotate(${deg}deg)`;
      });
      root.querySelectorAll<HTMLElement>("[data-controller-compass]").forEach((el) => {
        el.style.transform = `rotate(${deg}deg)`;
      });
    },
    [view],
  );

  /* --- nav button active states in injected chrome --- */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.querySelectorAll(".js-s3d-nav__btn").forEach((btn) => {
      const t = btn.getAttribute("data-type");
      const isActive =
        (view === "genplan" && t === "genplan") ||
        (view === "flyby" && t === "flyby" && btn.getAttribute("data-flyby") === "1" && btn.getAttribute("data-side") === "outside") ||
        (view === "flat" && t === "flat");
      btn.classList.toggle("active", isActive);
    });
    root.querySelectorAll(".s3d__title.js-s3d-ctr__option__text").forEach((el) => {
      el.textContent = view === "flyby" ? "6. Etap" : view === "flat" ? "Villa" : "Genel Plan";
    });
  }, [view]);

  /* --- theme toggle state --- */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.querySelectorAll(".js-s3d-ctr__theme").forEach((el) => el.classList.toggle("active", dark));
    root.querySelectorAll("[data-mobile-theme-switcher]").forEach((el) => {
      const mode = el.getAttribute("data-mobile-theme-switcher");
      el.classList.toggle("active", (mode === "dark") === dark);
    });
  }, [dark]);

  /* --- helper step sync --- */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.querySelectorAll(".js-s3d__helper-gif").forEach((el) => el.setAttribute("data-step", String(helperStep)));
  }, [helperStep, helperOpen]);

  const navigate = useCallback(
    (params: string) => {
      router.push(`/genplan${params}`);
    },
    [router],
  );

  /* --- delegated interactions for injected markup --- */
  const onClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      const closest = (sel: string) => target.closest(sel);

      const poly = closest("polygon.js-s3d-svg__build") as SVGPolygonElement | null;
      if (poly) {
        const pType = poly.getAttribute("data-type");
        if (pType === "flyby") {
          const flyby = poly.getAttribute("data-flyby");
          const side = poly.getAttribute("data-side");
          if (flyby === "1" && side === "outside") navigate("?type=flyby&flyby=1&side=outside");
          else {
            console.warn(`flyby ${flyby}/${side} is not available in the clone (no frame captures)`);
            setFlybyUnavailable(true);
          }
        } else if (pType === "flat") {
          const id = poly.getAttribute("data-id");
          if (id) navigate(`?type=flat&id=${id}`);
        }
        return;
      }

      if (closest("[data-form-layout-close]")) return setFormOpen(false);
      if (closest("[data-open-form]")) return setFormOpen(true);
      if (closest(".form-layout") && !closest(".form")) return setFormOpen(false);

      if (closest("[data-menu-close]")) return setMenuOpen(false);
      if (closest(".s3d__menu") && !closest("[data-s3d-share]")) return setMenuOpen(true);
      if (closest("[data-s3d-share]")) {
        void navigator.clipboard?.writeText(window.location.href);
        return;
      }

      if (closest("[data-fullscreen-mode-off]")) {
        void document.exitFullscreen?.();
        return;
      }
      if (closest("[data-fullscreen-mode]")) {
        void document.documentElement.requestFullscreen?.();
        return;
      }

      if (closest(".js-s3d__button-left")) return viewerRef.current?.rotate(-1);
      if (closest(".js-s3d__button-right")) return viewerRef.current?.rotate(1);

      const mobileTheme = closest("[data-mobile-theme-switcher]");
      if (mobileTheme) {
        setDark(mobileTheme.getAttribute("data-mobile-theme-switcher") === "dark");
        return;
      }
      const themeWidget = closest(".js-s3d-ctr__theme") as HTMLElement | null;
      if (themeWidget) {
        /* the label click forwards a second (synthetic) click to the checkbox —
           react only to the checkbox click to avoid double-toggling */
        if (target instanceof HTMLInputElement) setDark(target.checked);
        else if (!target.closest("label")) {
          const input = themeWidget.querySelector<HTMLInputElement>("input.s3d-ctr__switch");
          if (input) {
            input.checked = !input.checked;
            setDark(input.checked);
          } else {
            setDark((d) => !d);
          }
        }
        return;
      }

      if (closest(".js-s3d-ctr__helper")) {
        setHelperStep(0);
        setHelperOpen(true);
        return;
      }
      if (closest(".js-s3d__helper-gif-wrap")) {
        setHelperStep((s) => {
          if (s >= 3) {
            setHelperOpen(false);
            return 0;
          }
          return s + 1;
        });
        return;
      }

      if (closest(".js-s3d-flat__3d-tour")) return setMapOpen(true);
      if (closest(".js-s3d-ctr__filter")) return setFilterOpen(true);

      if (closest(".s3d-popup-flyby [data-type='close']") || closest(".s3d-popup-flyby [data-type='next']")) {
        return setFlybyUnavailable(false);
      }

      if (closest("[data-history-back-button]")) {
        router.back();
        return;
      }

      if (closest("[data-mobile-functions-menu-close]")) {
        rootRef.current?.querySelector("[data-mobile-functions-menu]")?.classList.remove("active");
        return;
      }
      if (closest("[data-mobile-functions-menu-open]")) {
        rootRef.current?.querySelector("[data-mobile-functions-menu]")?.classList.add("active");
        return;
      }
      if (closest("[data-mobile-navigation-menu-close]")) {
        rootRef.current?.querySelector("[data-mobile-navigation-menu]")?.classList.remove("active");
        return;
      }
      if (closest("[data-mobile-navigation-menu-open]")) {
        rootRef.current?.querySelector("[data-mobile-navigation-menu]")?.classList.add("active");
        return;
      }

      const nav = closest(".js-s3d-nav__btn") as HTMLElement | null;
      if (nav) {
        const t = nav.getAttribute("data-type");
        if (t === "genplan") navigate("?type=genplan");
        else if (t === "flyby") {
          const flyby = nav.getAttribute("data-flyby");
          const side = nav.getAttribute("data-side");
          if (flyby === "1" && side === "outside") navigate("?type=flyby&flyby=1&side=outside");
          else setFlybyUnavailable(true);
        } else {
          console.warn(`view "${t}" is not available in the clone`);
        }
        return;
      }
    },
    [navigate, router],
  );

  const onSubmitCapture = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setFormOpen(false);
  }, []);

  const overlays = view === "flyby" ? FLYBY1_OUTSIDE_OVERLAYS : MASTERPLAN_OVERLAYS;
  const overlayHtml = overlays[String(controlFrame)];
  const showOverlay = view !== "flat" && ready && !rotating && overlayHtml !== undefined;

  return (
    <div
      ref={rootRef}
      className="s3d-genplan-root"
      data-type={view}
      data-s3d-touch-mode="mouse"
      onClick={onClick}
      onSubmitCapture={onSubmitCapture}
    >
      <span style={{ display: "none" }} dangerouslySetInnerHTML={CHROME} />

      {view !== "flat" && (
        <div className="s3d-stage">
          <FrameViewer
            ref={viewerRef}
            frameSet={frameSet}
            onProgress={setProgress}
            onReady={() => setReady(true)}
            onRotatingChange={setRotating}
            onSettle={(cf) => setControlFrame(cf)}
            onFrame={onFrame}
          />
          {view === "genplan" && !dark && <div className="s3d-clouds" aria-hidden="true" />}
          {showOverlay && (
            <div
              className="s3d-overlay-host"
              dangerouslySetInnerHTML={{
                __html: overlayHtml.replace('class="s3d__svgWrap', 'class="s3d__svgWrap s3d__svg__active'),
              }}
            />
          )}
        </div>
      )}

      <div className="header" dangerouslySetInnerHTML={HEADER} />
      {view !== "flat" && <div dangerouslySetInnerHTML={CTR_HTML} />}

      {view === "flat" && flatId && <GenplanFlat id={flatId} />}

      <FilterPanel open={filterOpen} onClose={() => setFilterOpen(false)} />

      <div className={`s3d-menu-host${menuOpen ? " open" : ""}`} dangerouslySetInnerHTML={MENU_HTML} />
      {helperOpen && <div className="s3d-helper-host open" dangerouslySetInnerHTML={HELPER_HTML} />}
      {formOpen && <div className="s3d-form-host open" dangerouslySetInnerHTML={FORM_HTML} />}
      {flybyUnavailable && <div className="s3d-popup-flyby-host open" dangerouslySetInnerHTML={POPUP_FLYBY_HTML} />}

      {mapOpen && (
        <div className="s3d-map-popup" onClick={() => setMapOpen(false)}>
          <iframe src={MAP_EMBED_URL} title="Haritada Konum" allowFullScreen loading="lazy" />
        </div>
      )}

      {view !== "flat" && !ready && (
        <div className="s3d-loader-host" dangerouslySetInnerHTML={LOADER_HTML} />
      )}
    </div>
  );
}
