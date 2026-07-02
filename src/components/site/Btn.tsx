import Link from "next/link";
import type { CSSProperties, MouseEventHandler } from "react";

interface BtnProps {
  label: string;
  href?: string;
  external?: boolean;
  variant?: "orange" | "border";
  icon?: "def" | "line";
  className?: string; // extra classes: link | cta | submit | map ...
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: MouseEventHandler;
  ariaLabel?: string;
}

/** Per-letter spans exactly like the original .btn-text markup (staggered hover). */
function LetterText({ label }: { label: string }) {
  let letterIndex = 0;
  return (
    <div className="btn-text" aria-hidden="true">
      {[...label].map((ch, i) => {
        if (ch === " ") {
          letterIndex++;
          return <span key={i}>&nbsp;</span>;
        }
        return (
          <span key={i} style={{ "--i": letterIndex++ } as CSSProperties}>
            {ch}
          </span>
        );
      })}
    </div>
  );
}

export function Btn({
  label,
  href,
  external,
  variant = "orange",
  icon = "def",
  className = "",
  type = "button",
  disabled,
  onClick,
  ariaLabel,
}: BtnProps) {
  const cls = `btn btn-${variant} ${className}`.trim();
  const inner = (
    <>
      <LetterText label={label} />
      <div className={`btn-icon mask ${icon}`} aria-hidden="true" />
    </>
  );
  if (href && external) {
    return (
      <a className={cls} href={href} target="_blank" rel="noreferrer" aria-label={ariaLabel ?? label} onClick={onClick}>
        {inner}
      </a>
    );
  }
  if (href) {
    return (
      <Link className={cls} href={href} aria-label={ariaLabel ?? label} onClick={onClick}>
        {inner}
      </Link>
    );
  }
  return (
    <button className={cls} type={type} disabled={disabled} aria-label={ariaLabel ?? label} onClick={onClick}>
      {inner}
    </button>
  );
}
