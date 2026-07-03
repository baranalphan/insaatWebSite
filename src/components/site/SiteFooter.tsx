import Link from "next/link";
import { FooterLogoSvg } from "./FooterLogoSvg";
import { SocialIcons } from "./SocialIcons";

const NAV = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/lagom", label: "LAGOM" },
  { href: "/unique", label: "UNIQUE" },
  { href: "/contacts", label: "İletişim" },
  { href: "/privacy-policy", label: "Gizlilik Politikası" },
];

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container md-space" data-lag="0.15">
        <div className="footer-logo flex-v">
          <div className="logo">
            <FooterLogoSvg />
          </div>
          <p>Fikirden uygulamaya kadar iyi düşünülmüş alanlar yaratan geliştirici.</p>
        </div>

        <div className="footer-pages flex-v">
          <p className="nav-title">Menü</p>
          <ul className="mulish-32">
            {NAV.map((item) => (
              <li key={item.href} className="menu-item">
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-contacts flex-v">
          <div className="top">
            <p className="nav-title">İletişim</p>
            <a className="tell mulish-24" href="tel:380936060300">
              +38 093 60 60 300
            </a>
            <a className="mail mulish-24" href="mailto:lagomdev.office@gmail.com">
              lagomdev.office@gmail.com
            </a>
          </div>
          <div className="bottom flex-v">
            <p className="nav-title">Sosyal Medya</p>
            <SocialIcons />
          </div>
        </div>

        <div className="footer-copy">
          <p>©2026 Lagom development All Rights Reserved</p>
        </div>
        <div className="footer-boo">
          <a href="https://bambukstudio.com">Designed &amp; Developed by Bambuk</a>
        </div>
        <div className="footer-line" />
        <div className="footer-sub">
          <p className="mulish-24-regular">
            {"Lagom Development şirketi, Ukrayna Silahlı Kuvvetleri'ni destekleyen yardım kuruluşlarına, sosyal projelere ve altyapı yeniden yapılandırma projelerine yardım etmeyi taahhüt eder."}
          </p>
        </div>
      </div>
    </footer>
  );
}
