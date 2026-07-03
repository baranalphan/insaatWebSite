"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoSvg } from "./LogoSvg";
import { SocialIcons } from "./SocialIcons";
import { Btn } from "./Btn";

const NAV = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/lagom", label: "LAGOM" },
  { href: "/unique", label: "UNIQUE" },
  { href: "/contacts", label: "İletişim" },
];

/**
 * Fixed header. Hides on scroll down (class "hidden" -> translateY(-110%),
 * transition .45s ease-in-out) and reappears on any scroll up — same as original.
 * Mobile menu: "opened" on header + "active" on burger.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [opened, setOpened] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastY.current && y > 100) setHidden(true);
      else setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the mobile menu on navigation
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpened((prev) => (prev ? false : prev));
  }, [pathname]);

  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className={`header${hidden && !opened ? " hidden" : ""}${opened ? " opened" : ""}`}>
      <div className="header-wrapper">
        <div className="container">
          <div className="header-logo">
            <Link className="main-logo" href="/" aria-label="Lagom Development">
              <LogoSvg />
            </Link>
          </div>
          <menu className="header-menu">
            <ul className="inter-16-semi">
              {NAV.map((item) => (
                <li key={item.href} className="menu-item">
                  <Link
                    href={item.href}
                    aria-current={isCurrent(item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="header-menu-tell">
              <a href="tel:380936060300">+38 093 60 60 300</a>
            </div>
            <div className="header-menu-email">
              <a href="mailto:lagomdev.office@gmail.com">lagomdev.office@gmail.com</a>
            </div>
            <div className="header-menu-soc">
              <SocialIcons />
            </div>
          </menu>
          <div className="header-cta">
            <Btn label="Ev Seçin" href="/genplan" variant="orange" icon="line" className="link" />
            <button
              className={`header-burger${opened ? " active" : ""}`}
              aria-label="Menü"
              onClick={() => setOpened((v) => !v)}
            >
              <span className="f" />
              <span className="s" />
              <span className="t" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
