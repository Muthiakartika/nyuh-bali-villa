import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "accent" | "secondary" | "on-dark";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  /** Booking-engine and social destinations open in a new tab and need a plain
   * `<a>`; in-app routes use next/link for client navigation. */
  external?: boolean;
  className?: string;
};

/*
 * Transcribed from DESIGN.md → Components → Buttons. Every variant there is a
 * pill (`{rounded.full}`) at `12px 24px` with `{typography.button-md}` =
 * 14px/500 — so the geometry is shared and only the colour role differs.
 *
 * **Interaction states follow DESIGN.md's no-hover policy**, which states
 * plainly: "hover states are NOT documented. Default and pressed/active states
 * only." So the feedback here is `active:` (pressed), not `hover:`. That is a
 * deliberate reversal of the previous design, which leaned on hover for every
 * affordance — a pattern that gives touch users nothing at all.
 *
 *   primary   → brand brown fill, pressed lifts to `charcoal`
 *   accent    → brand gold fill with brown text (6.93:1); the emphasis variant,
 *               and the only one that reads on a brown bar
 *   secondary → outlined, 1px `hairline-strong`
 *   on-dark   → white pill for the dark CTA band
 */
const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "bg-primary text-on-primary active:bg-charcoal",
  accent: "bg-accent text-primary active:bg-accent-deep",
  secondary: "border border-hairline-strong bg-transparent text-ink active:bg-surface",
  "on-dark": "bg-on-dark text-primary active:bg-hairline",
};

/**
 * Shared class string, exported separately so a real `<button type="submit">`
 * (the contact form's Send) can look identical to the link-shaped CTAs without
 * being wrapped in an anchor it has no business being.
 */
export function buttonClassName(variant: ButtonVariant = "primary", extra = "") {
  return [
    // px-6 py-3 is exactly the documented 12px 24px.
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3",
    "text-body-sm font-medium",
    "transition-colors duration-200",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-dark",
    VARIANT_CLASS[variant],
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

export function Button({
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
}: ButtonProps) {
  const classes = buttonClassName(variant, className);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
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

/**
 * `button-icon-circular` from DESIGN.md — the 36×36 utility control used for
 * carousel arrows and other micro-actions.
 */
export function IconButton({
  children,
  label,
  onClick,
  className = "",
}: {
  children: ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      // 36px is the documented size, but that is below a comfortable touch
      // target, so the visible circle keeps 36px while padding takes the hit
      // area to 44px. DESIGN.md documents appearance, not tap ergonomics.
      className={`flex h-11 w-11 items-center justify-center rounded-full text-ink ${className}`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-canvas transition-colors duration-200 active:bg-surface">
        {children}
      </span>
    </button>
  );
}
