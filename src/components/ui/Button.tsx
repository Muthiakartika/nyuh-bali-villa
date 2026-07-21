import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant = "solid" | "outline" | "outline-light";
type ButtonSize = "sm" | "md";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Booking-engine and social destinations open in a new tab and need a
   * plain `<a>`; in-app routes use next/link for client navigation. */
  external?: boolean;
  className?: string;
};

/*
 * Colour choices here are a contrast fix as much as a style one.
 *
 * The old CTA was `bg-primary` with white text — gold #c7a259 against white
 * measures 2.39:1, which fails WCAG AA badly for 14px uppercase text. The
 * *same* gold with the brand's own `ink` on top measures 6.93:1 and passes
 * comfortably. Dark type on a metallic fill is also the more expensive-looking
 * of the two pairings, so the accessible option is the better-looking one.
 *
 * Hover inverts the fill rather than dimming opacity. `hover:opacity-90` was
 * used as the universal hover across the old design; opacity is what you
 * reach for when no hover has actually been designed, and it makes an element
 * look disabled at the exact moment it should look ready.
 */
const VARIANT_CLASS: Record<ButtonVariant, string> = {
  solid: "bg-primary text-ink hover:bg-ink hover:text-primary",
  outline:
    "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-sand",
  "outline-light":
    "border border-white/35 text-white hover:border-primary hover:bg-primary hover:text-ink",
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: "px-6 py-3 text-[11px] tracking-[0.2em]",
  md: "px-8 py-3.5 text-xs tracking-[0.22em]",
};

/**
 * Shared class string, exported separately so a real `<button type="submit">`
 * (the contact form's Send) can look identical to the link-shaped CTAs
 * without being wrapped in an anchor it has no business being.
 */
export function buttonClassName(
  variant: ButtonVariant = "solid",
  size: ButtonSize = "md",
  extra = "",
) {
  return [
    "inline-flex items-center justify-center rounded-none font-body uppercase",
    "transition-colors duration-500 ease-out",
    "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
    SIZE_CLASS[size],
    VARIANT_CLASS[variant],
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * The site's one call-to-action component.
 *
 * `rounded-none` is deliberate and matches the cards: the old design used
 * `rounded-[3px]` here and `rounded-md` on media, an in-between radius that
 * reads as a UI framework default rather than a decision. Square edges are
 * the architectural choice, and they let the gold fill read as a printed
 * block of colour.
 */
export function Button({
  href,
  children,
  variant = "solid",
  size = "md",
  external = false,
  className = "",
}: ButtonProps) {
  const classes = buttonClassName(variant, size, className);

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
