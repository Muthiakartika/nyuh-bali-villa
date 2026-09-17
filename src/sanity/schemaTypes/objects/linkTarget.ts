import { defineField } from "sanity";

/**
 * The document types an internal link can point at, and the one place that
 * list is written down.
 *
 * Every one of these either carries an explicit `path` (page, post, legal
 * page) or has a URL this project derives from its slug (room, experience) —
 * `linkHrefProjection` in lib/queries.ts computes both, so a reference and a
 * hand-typed path arrive at the renderer in the same shape.
 *
 * A reference is preferred over a typed path for the reason the brief gives:
 * a page that moves takes its links with it, and a link to a document that
 * was never published is visible in the Studio rather than as a 404 a visitor
 * finds first.
 */
export const linkableTypes = [
  { type: "page" },
  { type: "post" },
  { type: "room" },
  { type: "experience" },
  { type: "legalPage" },
];

export const linkTypeField = defineField({
  name: "linkType",
  title: "Link to",
  type: "string",
  options: {
    layout: "radio",
    list: [
      { title: "A page on this site", value: "internal" },
      { title: "A file to open — a menu, a price list", value: "file" },
      { title: "A web address I type myself", value: "custom" },
    ],
  },
  initialValue: "custom",
  description:
    "Pick a published page wherever one exists — the link then follows that page if its address ever changes. Choose “A file” to replace the PDF this button opens.",
});

export const linkReferenceField = defineField({
  name: "reference",
  title: "Page",
  type: "reference",
  to: linkableTypes,
  hidden: ({ parent }) => parent?.linkType !== "internal",
  validation: (Rule) =>
    Rule.custom((value, context) => {
      const parent = context.parent as { linkType?: string } | undefined;
      if (parent?.linkType !== "internal") return true;
      return value ? true : "Choose the page this links to.";
    }),
});

/**
 * Whether a typed destination already points at a file rather than a page.
 * Used only to decide whether to *offer* the upload box; nothing renders
 * differently because of it.
 */
function isFileHref(href?: string): boolean {
  if (!href) return false;
  const path = href.split("?")[0].split("#")[0].toLowerCase();
  return /\.(pdf|jpe?g|png)$/.test(path);
}

/**
 * A file the button opens — the F&B and spa menus, the room directories.
 *
 * Before this the PDFs could only be swapped by a developer: the button's
 * destination was a path into `public/uploads/`, which is in the repository,
 * so "change the F&B menu" meant an edit and a deploy. That was the client's
 * first real request and the one thing the CMS could not do.
 *
 * It resolves exactly like an image does — `linkHrefProjection` reads the
 * uploaded asset's URL — so the typed path stays as the fallback and nothing
 * breaks on a button whose file has not been uploaded yet.
 */
export const linkFileField = defineField({
  name: "file",
  title: "File",
  type: "file",
  options: { accept: ".pdf,.jpg,.jpeg,.png" },
  description:
    "Drop the new menu here and press Publish — it replaces the file this button opens, everywhere the button appears on this page.",
  hidden: ({ parent }) => {
    const linkType = (parent as { linkType?: string } | undefined)?.linkType;
    if (linkType) return linkType !== "file";
    // Every link the migration seeded carries no `linkType` at all, so the
    // radio above reads as unset — and keying the upload box off it alone
    // hid this field on all 46 menu buttons the feature was built for. The
    // client's report was simply that there was no way to upload a PDF.
    // With nothing chosen, let the destination itself say what this is.
    return !isFileHref((parent as { href?: string } | undefined)?.href);
  },
  validation: (Rule) =>
    Rule.custom((value, context) => {
      const parent = context.parent as { linkType?: string } | undefined;
      if (parent?.linkType !== "file") return true;
      return (value as { asset?: unknown } | undefined)?.asset
        ? true
        : "Upload a file, or choose a different kind of destination.";
    }),
});

/**
 * The typed destination. Still the field most links use, and still what a
 * reference falls back to, so nothing authored before references existed
 * needs changing.
 */
export function hrefField({
  required = false,
  title = "Destination",
  description = "Use /ubud/spa for a page on this site, or https://… for the booking engine and other external destinations.",
}: { required?: boolean; title?: string; description?: string } = {}) {
  return defineField({
    name: "href",
    title,
    type: "string",
    description,
    hidden: ({ parent }) =>
      parent?.linkType === "internal" || parent?.linkType === "file",
    validation: (Rule) =>
      Rule.custom((value, context) => {
        const parent = context.parent as { linkType?: string } | undefined;
        if (parent?.linkType === "internal" || parent?.linkType === "file") return true;
        if (!value) return required ? "Enter a destination." : true;
        if (value.startsWith("/") || value.startsWith("#")) return true;
        if (/^(https?:\/\/|mailto:|tel:)/.test(value)) return true;
        return "Use a site path beginning with / or a complete http(s), mailto: or tel: URL.";
      }),
  });
}
