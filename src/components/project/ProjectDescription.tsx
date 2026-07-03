"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RichReveal } from "./RichReveal";
import type { ProjectPageData } from "./data";

gsap.registerPlugin(ScrollTrigger);

/** Counts the number(s) in `value` up from 0 when scrolled into view (once). */
function CounterNumber({ as = "sup", value }: { as?: "sup" | "strong"; value: string }) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const tokens = value.split(/(\d+)/);
    const targets = tokens.map((t) => (/^\d+$/.test(t) ? parseInt(t, 10) : null));
    const state = { p: 0 };
    const ctx = gsap.context(() => {
      gsap.fromTo(state, { p: 0 }, {
        p: 1,
        duration: 1.5,
        ease: "power1.out",
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
        onUpdate: () => {
          el.textContent = tokens
            .map((t, i) => (targets[i] === null ? t : String(Math.round(targets[i] * state.p))))
            .join("");
        },
      });
    }, el);
    return () => ctx.revert();
  }, [value]);

  const Tag = as;
  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        ref.current = node;
      }}
    >
      {value}
    </Tag>
  );
}

export function ProjectDescription({ data }: { data: ProjectPageData }) {
  return (
    <section className="description">
      <div className="container md-space">
        <div className="container-index">002</div>

        <div className="container-content">
          <RichReveal className="mulish-64-light">{data.descriptionTitle}</RichReveal>
        </div>

        <ul className="container-list">
          {data.stats.map((stat) => (
            <li key={stat.name} className="flex-v" data-reveal-numbers="">
              <p className="from mulish-24-regular">
                {stat.prefix}
                <CounterNumber value={stat.value} />
                {stat.suffix}
                {stat.top && (
                  <span className="top">
                    {stat.top.prefix}
                    <CounterNumber as="strong" value={stat.top.value} />
                  </span>
                )}
              </p>
              <div className="line"></div>
              <p className="name mulish-24">{stat.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
