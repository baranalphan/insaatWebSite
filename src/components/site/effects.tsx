"use client";

import { Fragment, useLayoutEffect, useRef } from "react";
import type { CSSProperties, HTMLAttributes, ReactNode, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* RevealText — [data-reveal-text] headings                            */
/* ------------------------------------------------------------------ */

type RevealTag = "h1" | "h2" | "h3" | "h4" | "p" | "div";

interface RevealTextProps {
  text: string;
  as?: RevealTag;
  className?: string;
  /** Raw value of the original `data-options` attribute (kept for 1:1 fidelity). */
  options?: string;
}

/** SplitText-style inline layout (the original applies these inline). */
const splitStyle: CSSProperties = { display: "inline-block", position: "relative" };

/**
 * Port of the original `[data-reveal-text]` behavior: splits the heading into
 * `<div class="word">` > `<div class="char">` per letter (words are inline-block
 * divs separated by normal spaces), sets `aria-label` with the full text and
 * staggers the chars from the CSS base `opacity: 0.2` to `1` on scroll entry.
 */
export function RevealText({ text, as = "h2", className, options }: RevealTextProps) {
  const ref = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll(".char"),
        { opacity: 0.2 },
        {
          opacity: 1,
          stagger: 0.05,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [text]);

  const Tag = as;
  const words = text.split(" ").filter(Boolean);

  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        ref.current = node;
      }}
      className={className}
      data-reveal-text=""
      aria-label={text}
      {...(options ? { "data-options": options } : {})}
    >
      {words.map((word, wi) => (
        <Fragment key={wi}>
          {wi > 0 && " "}
          <div className="word" aria-hidden="true" style={splitStyle}>
            {[...word].map((ch, ci) => (
              <div key={ci} className="char" style={splitStyle}>
                {ch}
              </div>
            ))}
          </div>
        </Fragment>
      ))}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* FadeIn / useFadeIn — [data-fade] elements                           */
/* ------------------------------------------------------------------ */

/**
 * Fade-in on viewport entry for `[data-fade]` elements. The ported CSS sets the
 * resting state (`[data-fade] { opacity: 0 }`), so the tween runs fromTo:
 * `{ autoAlpha: 0, y: 40 }` → `{ autoAlpha: 1, y: 0 }`.
 */
export function useFadeIn<T extends HTMLElement>(ref: RefObject<T | null>): void {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [ref]);
}

type FadeTag = "div" | "section" | "span" | "p" | "ul" | "li" | "a" | "button" | "h2" | "h3" | "h4";

interface FadeInProps extends HTMLAttributes<HTMLElement> {
  as?: FadeTag;
  /** Value of the original `data-fade` attribute ("" or e.g. "up"). */
  fade?: string;
  children?: ReactNode;
  [dataAttr: `data-${string}`]: unknown;
}

/** Renders an element carrying the original `data-fade` attribute + fade-in tween. */
export function FadeIn({ as = "div", fade = "", children, ...rest }: FadeInProps) {
  const ref = useRef<HTMLElement | null>(null);
  useFadeIn(ref);
  const Tag = as;
  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        ref.current = node;
      }}
      data-fade={fade}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* useUnclip — [data-unclip] scroll-scrubbed clip reveal               */
/* ------------------------------------------------------------------ */

/**
 * Scroll-scrubbed clip reveal for elements with `data-unclip`. Desktop only —
 * `data-unclip='{"max-width": "1024px"}'` disables the effect below 1025px.
 */
export function useUnclip<T extends HTMLElement>(ref: RefObject<T | null>): void {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add("(min-width: 1025px)", () => {
        gsap.from(el, {
          clipPath: "inset(50% 0% 50% 0%)",
          ease: "none",
          scrollTrigger: {
            trigger: el,
            scrub: true,
            start: "clamp(0% 60%)",
            end: "clamp(0% 15%)",
          },
        });
      });
    }, el);
    return () => {
      mm.revert();
      ctx.revert();
    };
  }, [ref]);
}
