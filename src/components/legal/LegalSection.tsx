import type { LegalSection as LegalSectionData } from "@/data/legal";

type LegalSectionProps = {
  section: LegalSectionData;
};

/**
 * One numbered section of Terms & Conditions or Privacy Policy: a heading
 * ("3. Check‑In & Check‑Out") followed by either a single paragraph or a
 * bulleted list, matching the live site's own mix — most sections are
 * lists, but a few (the opening "Acceptance"/"Introduction" section on
 * each page, plus one further down) are a single sentence instead. The
 * `type` discriminant on `LegalSectionData` is what lets this component
 * render either shape without a runtime check on `items` being present.
 *
 * Redesign note (see "Modern redesign" in CLAUDE.md): the copy is unchanged,
 * but the list markers are now small gold dots instead of the browser's
 * default `list-disc` bullets, and body text gets looser leading. Legal pages
 * are the densest reading on the site, so the extra line spacing does real
 * work here. Renders a `<section>` rather than a `<div>` now that it has a
 * heading of its own.
 */
export function LegalSection({ section }: LegalSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-heading text-2xl font-semibold text-primary">
        {section.heading}
      </h2>

      {section.type === "paragraph" ? (
        <p className="text-lg leading-[1.8] font-light text-text">{section.text}</p>
      ) : (
        <ul className="flex flex-col gap-3 text-lg leading-[1.8] font-light text-text">
          {section.items.map((item) => (
            // `pl-6` reserves the space the absolutely-positioned dot sits
            // in, so wrapped lines align with the first line rather than
            // running back under the marker. `whitespace-pre-line` preserves
            // the intentional line breaks inside some of the source items.
            <li key={item} className="relative pl-6 whitespace-pre-line">
              <span
                aria-hidden
                className="absolute top-[0.75em] left-0 block h-1.5 w-1.5 rounded-full bg-primary"
              />
              {item}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
