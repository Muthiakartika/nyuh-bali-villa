import type { LegalSection as LegalSectionData } from "@/data/legal";

type LegalSectionProps = {
  section: LegalSectionData;
};

/**
 * One numbered section of Terms & Conditions or Privacy Policy: a heading
 * ("3. Check‑In & Check‑Out") followed by either a single paragraph or a
 * bulleted list, matching the live site's own mix — most sections are lists,
 * but a few (the opening "Acceptance"/"Introduction" section on each page,
 * plus one further down) are a single sentence instead. The `type`
 * discriminant on `LegalSectionData` is what lets this render either shape
 * without a runtime check on `items` being present.
 *
 * The heading moved from gold to `ink` for the same reason every other heading
 * on the site did — gold on a light surface measures 2.39:1 — and it matters
 * more here than anywhere else, because legal copy is the one thing on the site
 * someone may actually be obliged to read. Gold stays on the list markers,
 * where contrast carries no meaning.
 */
/**
 * The Legal page document's optional Intro — a paragraph between the title and
 * the first numbered section. Neither page publishes one today, so this
 * renders nothing on either; it exists so the field in the Studio does what
 * it says rather than being stored and ignored. Same type as a paragraph
 * section, at the band's own heading→content gap; `whitespace-pre-line` keeps
 * the line breaks an editor types into the plain-text field.
 */
export function LegalIntro({ text }: { text?: string }) {
  const intro = text?.trim();
  if (!intro) return null;
  return (
    <p className="mt-8 text-[17px] leading-[1.9] font-light whitespace-pre-line text-text md:mt-10">
      {intro}
    </p>
  );
}

export function LegalSection({ section }: LegalSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-heading text-xl font-normal text-ink md:text-2xl">
        {section.heading}
      </h2>

      {section.type === "paragraph" ? (
        <p className="text-[17px] leading-[1.9] font-light text-text">
          {section.text}
        </p>
      ) : (
        <ul className="flex flex-col gap-3.5 text-[17px] leading-[1.9] font-light text-text">
          {section.items.map((item) => (
            // `pl-7` reserves the space the absolutely-positioned marker sits
            // in, so wrapped lines align with the first line rather than
            // running back under it. `whitespace-pre-line` preserves the
            // intentional line breaks inside some of the source items.
            <li key={item} className="relative pl-7 whitespace-pre-line">
              {/* A short gold rule rather than a dot — the same mark used
                  under every heading on the site, at list scale. */}
              <span
                aria-hidden
                className="absolute top-[0.95em] left-0 block h-px w-3.5 bg-primary"
              />
              {item}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
