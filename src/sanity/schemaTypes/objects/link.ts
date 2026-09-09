import { defineField, defineType } from "sanity";

/**
 * `inScope` mirrors the flag the site already carries on every nav item and
 * card (see PropertyNavItem, LinkCardItem): a destination this project does
 * not build renders inert rather than linking to a 404. Keeping it editable
 * means a link can be switched on the day its page ships, without a deploy.
 */
export const link = defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: "href",
      title: "Destination",
      type: "string",
      description:
        "Use /ubud/spa for a page on this site, or https://… for the booking engine and other external destinations.",
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value) return true;
          if (value.startsWith("/") || /^(https?:\/\/|mailto:|tel:)/.test(value)) return true;
          return "Use a site path beginning with / or a complete http(s), mailto: or tel: URL.";
        }),
    }),
    defineField({
      name: "external",
      title: "Open in a new tab",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "inScope",
      title: "This page exists on the site",
      type: "boolean",
      initialValue: true,
      description:
        "Turn off for a destination that has not been built yet. The label still shows but does not link anywhere, instead of sending visitors to a missing page.",
    }),
    defineField({
      name: "variant",
      title: "Button style",
      type: "string",
      options: {
        layout: "radio",
        list: [
          { title: "Solid", value: "solid" },
          { title: "Outline", value: "outline" },
        ],
      },
      initialValue: "solid",
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "href" },
  },
});
