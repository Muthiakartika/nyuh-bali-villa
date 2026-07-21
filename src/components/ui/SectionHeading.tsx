import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

type SectionHeadingProps = {
  /** Small pill label above the heading. In the DWELLA reference composition
   * every major band opens with one of these outlined chips ("About Us"), so
   * it is a layout device here, not decoration. */
  eyebrow?: string;
  title: string;
  /** One `<h1>` per page; every other band heading is an `<h2>`. */
  as?: "h1" | "h2";
  /** Whether this sits on a light surface or the dark `primary` band. */
  surface?: "light" | "dark";
  /**
   * Optional right-hand column. DWELLA pairs its section headings with a
   * supporting paragraph and, on carousels, the prev/next controls — heading
   * left, everything else right, sharing one baseline.
   */
  trailing?: ReactNode;
  /** Heading step from the DESIGN.md ramp. `h2` (36px) is the band default;
   * `h1` (48px) opens a page. */
  size?: "h1" | "h2";
  className?: string;
};

/**
 * The heading lockup used by every band.
 *
 * Type comes straight off the DESIGN.md ramp — no literal `text-[Npx]` values,
 * which is exactly what `impeccable detect` flags. Weight is 500 at every
 * heading step, per the spec.
 */
export function SectionHeading({
  eyebrow,
  title,
  as: Tag = "h2",
  surface = "light",
  trailing,
  size = "h2",
  className = "",
}: SectionHeadingProps) {
  const isDark = surface === "dark";

  return (
    <div
      className={`flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-16 ${className}`}
    >
      <Reveal className="flex flex-col items-start">
        {eyebrow ? (
          // `{rounded.full}` chip with a hairline border — DESIGN.md's badge
          // geometry, used here as the section eyebrow.
          <span
            className={`mb-5 inline-flex rounded-full border px-4 py-1.5 text-caption font-medium ${
              isDark
                ? "border-white/25 text-on-dark"
                : "border-hairline-strong text-slate"
            }`}
          >
            {eyebrow}
          </span>
        ) : null}

        <Tag
          className={`font-medium ${size === "h1" ? "text-h1" : "text-h2"} ${
            isDark ? "text-on-dark" : "text-ink"
          }`}
        >
          {title}
        </Tag>
      </Reveal>

      {trailing ? (
        <Reveal delay={120} className="md:max-w-[420px] md:shrink-0">
          {trailing}
        </Reveal>
      ) : null}
    </div>
  );
}
