import type { LegalSection as LegalSectionData } from "@/data/legal";

type LegalSectionProps = {
  section: LegalSectionData;
};

/**
 * One numbered section of Terms & Conditions or Privacy Policy: a heading
 * followed by either a paragraph or a bulleted list, matching the source
 * content's own mix. The `type` discriminant on `LegalSectionData` is what lets
 * this render either shape without a runtime check on `items`.
 *
 * Type is on the DESIGN.md ramp (`h4` for headings, `body` for prose) rather
 * than the ad-hoc 17px this used to carry — legal copy is the one thing on the
 * site someone may be obliged to read, so it gets the documented steps.
 */
export function LegalSection({ section }: LegalSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-h4 font-medium text-ink">{section.heading}</h2>

      {section.type === "paragraph" ? (
        <p className="text-body text-slate">{section.text}</p>
      ) : (
        <ul className="flex flex-col gap-3 text-body text-slate">
          {section.items.map((item) => (
            // `pl-6` reserves the space the marker sits in, so wrapped lines
            // align with the first rather than running back under it.
            // `whitespace-pre-line` preserves intentional breaks in the source.
            <li key={item} className="relative pl-6 whitespace-pre-line">
              <span
                aria-hidden
                className="absolute top-[0.6em] left-0 block h-1.5 w-1.5 rounded-full bg-accent"
              />
              {item}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
