/**
 * A one-line plain-text summary of a rich-text value, for Studio previews.
 *
 * A portable-text array shown raw in a preview reads as "[object Object]",
 * which is one of the things this audit set out to remove from the editor's
 * view. A string is passed straight through, so a field mid-migration
 * previews correctly whichever shape it is currently in.
 */
export function plainTextPreview(value: unknown, max = 120): string | undefined {
  if (typeof value === "string") return value.slice(0, max) || undefined;
  if (!Array.isArray(value)) return undefined;
  const text = value
    .map((block) => {
      const children = (block as { children?: { text?: string }[] })?.children;
      if (!Array.isArray(children)) return "";
      return children.map((child) => child?.text ?? "").join("");
    })
    .filter(Boolean)
    .join(" ")
    .trim();
  return text ? text.slice(0, max) : undefined;
}
