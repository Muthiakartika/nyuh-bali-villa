import type { PackageRun } from "@/components/property/PackageList";
import type { SanityRichTextValue } from "@/sanity/types";

/**
 * Portable text → the inline runs the site's own components take.
 *
 * `packageItem.description` and `packageListSection.intro` became rich text
 * so an editor can bold a word the way the in-room directory pages already
 * do. They render inside a `<p>` the layout draws, so what comes back is a
 * flat run list rather than blocks — the same shape `PackageRun[]` has always
 * been, which is why no renderer changed shape to accept this.
 *
 * **A string passes straight through.** Every published document held a
 * string before the migration, and `richText()` in lib/queries.ts hands one
 * back untouched when it finds one, so this has to accept both. That is what
 * makes the schema change safe before, during and after the migration.
 */
export function toRuns(value: SanityRichTextValue | undefined): string | PackageRun[] | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "string") return value;
  if (!Array.isArray(value)) return undefined;

  const runs: PackageRun[] = [];
  for (const block of value) {
    if (!block || typeof block !== "object") continue;
    const typed = block as unknown as {
      _type?: string;
      children?: { text?: string; marks?: string[] }[];
      markDefs?: { _key?: string; href?: string; blank?: boolean }[];
    };
    if (typed._type !== "block" || !Array.isArray(typed.children)) continue;

    // Paragraph breaks inside a single `<p>` become a space, not a newline:
    // the element has no `white-space` rule that would honour one, so a
    // newline would collapse and silently glue two sentences together.
    if (runs.length) runs.push({ text: " " });

    for (const child of typed.children) {
      const text = child?.text ?? "";
      if (!text) continue;
      const marks = child.marks ?? [];
      const annotation = typed.markDefs?.find(
        (def) => def?._key && marks.includes(def._key),
      );
      runs.push({
        text,
        bold: marks.includes("strong") || undefined,
        italic: marks.includes("em") || undefined,
        href: annotation?.href,
        external: annotation?.blank || undefined,
      });
    }
  }
  return runs.length ? runs : undefined;
}

/** The same value as one plain string — for `alt`, previews and metadata. */
export function richTextToPlainText(value: SanityRichTextValue | undefined): string {
  const runs = toRuns(value);
  if (!runs) return "";
  if (typeof runs === "string") return runs;
  return runs.map((run) => run.text).join("").trim();
}
