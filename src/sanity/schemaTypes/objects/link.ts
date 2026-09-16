import { defineField, defineType } from "sanity";
import {
  hrefField,
  linkFileField,
  linkReferenceField,
  linkTypeField,
} from "./linkTarget";

/**
 * The one call-to-action shape on the site: a label, a destination, and the
 * three flags the renderers already understand.
 *
 * `inScope` mirrors the flag the site already carries on every nav item and
 * card (see PropertyNavItem, LinkCardItem): a destination this project does
 * not build renders inert rather than linking to a 404. Keeping it editable
 * means a link can be switched on the day its page ships, without a deploy.
 *
 * A destination is either a **reference to a published document** or a typed
 * path/URL. Both resolve to one `href` before the renderer sees them
 * (`linkHrefProjection` in lib/queries.ts, `resolveLinkHref` in lib/links.ts),
 * so adding references broke nothing that was authored as a path.
 */
export const link = defineType({
  name: "link",
  title: "Button or link",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: "What the button says. Keep it short — two or three words.",
      validation: (Rule) => Rule.required().max(60),
    }),
    linkTypeField,
    linkReferenceField,
    linkFileField,
    hrefField({ required: true }),
    defineField({
      name: "external",
      title: "Open in a new tab",
      type: "boolean",
      initialValue: false,
      description:
        "Leave off for pages on this site. An external destination opens in a new tab automatically.",
    }),
    defineField({
      name: "inScope",
      title: "This destination exists",
      type: "boolean",
      initialValue: true,
      description:
        "Turn off for a page that has not been built yet. The label still shows but does not link anywhere, instead of sending visitors to a missing page.",
    }),
    defineField({
      name: "variant",
      title: "Button style",
      type: "string",
      options: {
        layout: "radio",
        list: [
          { title: "Solid (gold fill)", value: "solid" },
          { title: "Outline", value: "outline" },
        ],
      },
      initialValue: "solid",
    }),
  ],
  preview: {
    select: {
      title: "label",
      href: "href",
      linkType: "linkType",
      referencePath: "reference.path",
      referenceTitle: "reference.title",
    },
    prepare: ({ title, href, linkType, referencePath, referenceTitle }) => ({
      title: title || "Untitled link",
      subtitle:
        linkType === "internal"
          ? referencePath || referenceTitle || "No page chosen yet"
          : href || "No destination yet",
    }),
  },
});
