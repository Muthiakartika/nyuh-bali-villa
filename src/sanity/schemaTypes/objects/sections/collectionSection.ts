import { defineField, defineType } from "sanity";
import { eyebrowField, sectionSettingsFields, toneField } from "./shared";

/**
 * A section that lists documents rather than restating them — rooms, blog
 * posts, experiences, testimonials. The alternative was making an editor
 * copy every room into every page that lists it, which is exactly the
 * duplication the room documents exist to remove.
 */
export const collectionSection = defineType({
  name: "collectionSection",
  title: "Collection",
  type: "object",
  fields: [
    eyebrowField,
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 3 }),
    defineField({
      name: "collection",
      title: "What to list",
      type: "string",
      options: {
        list: [
          { title: "Rooms and villas", value: "room" },
          { title: "Blog posts", value: "post" },
          { title: "Experiences", value: "experience" },
          { title: "Testimonials", value: "testimonial" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "property",
      title: "Limit to one property",
      type: "string",
      options: {
        layout: "radio",
        list: [
          { title: "Both", value: "" },
          { title: "Seminyak", value: "seminyak" },
          { title: "Ubud", value: "ubud" },
        ],
      },
      initialValue: "",
    }),
    defineField({
      name: "group",
      title: "Limit to one experience group",
      type: "string",
      options: {
        layout: "radio",
        list: [
          { title: "All", value: "" },
          { title: "Retreat", value: "retreat" },
          { title: "Wellness", value: "wellness" },
          { title: "Culture", value: "culture" },
        ],
      },
      initialValue: "",
      hidden: ({ parent }) => parent?.collection !== "experience",
    }),
    defineField({
      name: "slugs",
      title: "Only these rooms, in this order",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Room slugs, e.g. suite or honeymoon/pool. Leave empty to list every room of the property. Ubud splits its inventory into two lists (suites, then villas), which is what this is for.",
      hidden: ({ parent }) => parent?.collection !== "room",
    }),
    defineField({
      name: "quotes",
      title: "Quotes",
      type: "array",
      of: [
        {
          type: "object",
          name: "quoteItem",
          fields: [
            { name: "quote", title: "Quote", type: "text", rows: 4 },
            { name: "author", title: "Author", type: "string" },
          ],
          preview: { select: { title: "author", subtitle: "quote" } },
        },
      ],
      description:
        "Written here rather than pulled from the testimonial documents. Several pages carry their own selection — the spa pages quote spa guests, the dining pages quote diners — and those are page copy, not the property's general reviews. Leave empty to list the property's testimonials instead.",
      hidden: ({ parent }) => parent?.collection !== "testimonial",
    }),
    defineField({
      name: "limit",
      title: "Maximum items",
      type: "number",
      description: "Leave empty to show every published item.",
      validation: (Rule) => Rule.min(1).max(48).integer(),
    }),
    defineField({ name: "action", title: "Closing action", type: "link" }),
    toneField,
    ...sectionSettingsFields,
  ],
  preview: {
    select: { title: "heading", collection: "collection", property: "property" },
    prepare: ({ title, collection, property }) => ({
      title: title || "Collection",
      subtitle: [collection, property].filter(Boolean).join(" · "),
    }),
  },
});
