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
 */
export function LegalSection({ section }: LegalSectionProps) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-heading text-2xl font-semibold text-primary">{section.heading}</h2>
      {section.type === "paragraph" ? (
        <p className="text-lg text-text">{section.text}</p>
      ) : (
        <ul className="list-disc space-y-2 pl-6 text-lg text-text">
          {section.items.map((item) => (
            <li key={item} className="whitespace-pre-line">
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
