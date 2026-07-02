const SOCIALS = [
  { href: "https://www.youtube.com/@lagomdevelopment", mask: "/images/2025_04_youtube.svg" },
  { href: "https://t.me/lagomdev_bot", mask: "/images/2025_05_nametelegram-statedefault-backgrounddark.svg" },
  { href: "https://www.tiktok.com/@lagom.dev", mask: "/images/2025_04_tiktok.svg" },
  { href: "https://www.instagram.com/lagom_development/", mask: "/images/2025_04_instagram.svg" },
];

export function SocialIcons() {
  return (
    <div className="social-icons">
      <div className="social-icons ">
        {SOCIALS.map((s) => (
          <a key={s.href} href={s.href} className="icon" aria-label={s.href} target="_blank" rel="noreferrer">
            <div className="mask" style={{ maskImage: `url(${s.mask})` }} />
          </a>
        ))}
      </div>
    </div>
  );
}
