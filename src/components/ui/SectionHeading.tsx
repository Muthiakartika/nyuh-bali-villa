import { Reveal } from "@/components/ui/Reveal";

type SectionHeadingProps = {
  /** Small letter-spaced label above the heading. Optional — only used where
   * an existing word from the site can carry it (a property name, an existing
   * nav label). No new copy is invented for it. */
  eyebrow?: string;
  title: string;
  /** One `<h1>` per page; every other section heading is an `<h2>`. */
  as?: "h1" | "h2";
  /** Whether this sits on a light surface (`sand`/`white`) or a dark one
   * (`ink`). Drives which gold is safe to use — see the contrast note on
   * `primary-deep` in globals.css. */
  surface?: "light" | "dark";
  align?: "left" | "center";
  /** `section` is the normal band heading; `display` is for the one heading
   * on a page that opens it. */
  size?: "section" | "display";
  className?: string;
};

/**
 * The heading lockup used by every band on the site: optional eyebrow, the
 * heading itself, and a short gold rule beneath.
 *
 * The rule and the eyebrow are where the brand's gold now lives. That's the
 * central typographic move of this redesign: on the old design the *heading*
 * was gold, at 2.39:1 against white — technically failing WCAG AA and, more
 * to the point, the single loudest "luxury website, 2005" signal a page can
 * send. Gold demoted to an accent and headings set in the brand's own dark
 * brown reads as more expensive, not less, and it costs no brand colour.
 */
export function SectionHeading({
  eyebrow,
  title,
  as: Tag = "h2",
  surface = "light",
  align = "left",
  size = "section",
  className = "",
}: SectionHeadingProps) {
  const isDark = surface === "dark";
  const isCentered = align === "center";

  return (
    <Reveal
      className={`flex flex-col ${isCentered ? "items-center text-center" : "items-start"} ${className}`}
    >
      {eyebrow ? (
        <span
          className={`text-eyebrow font-body uppercase ${
            isDark ? "text-primary" : "text-primary-deep"
          }`}
        >
          {eyebrow}
        </span>
      ) : null}

      <Tag
        className={`font-heading font-light ${
          size === "display" ? "text-display" : "text-section"
        } ${eyebrow ? "mt-3.5" : ""} ${isDark ? "text-white" : "text-ink"}`}
      >
        {title}
      </Tag>

      {/* Full-strength gold: as a 1px rule it carries no contrast burden, so
          this is exactly where the brand colour belongs. */}
      <span aria-hidden className="mt-5 block h-px w-14 bg-primary" />
    </Reveal>
  );
}
