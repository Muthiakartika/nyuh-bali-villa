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
      { title: "A web address I type myself", value: "custom" },
    ],
  },
  initialValue: "custom",
  description:
    "Pick a published page wherever one exists — the link then follows that page if its address ever changes.",
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
    hidden: ({ parent }) => parent?.linkType === "internal",
    validation: (Rule) =>
      Rule.custom((value, context) => {
        const parent = context.parent as { linkType?: string } | undefined;
        if (parent?.linkType === "internal") return true;
        if (!value) return required ? "Enter a destination." : true;
        if (value.startsWith("/") || value.startsWith("#")) return true;
        if (/^(https?:\/\/|mailto:|tel:)/.test(value)) return true;
        return "Use a site path beginning with / or a complete http(s), mailto: or tel: URL.";
      }),
  });
}
