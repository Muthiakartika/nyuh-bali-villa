import { defineArrayMember, defineField, defineType } from "sanity";
import { eyebrowField, sectionSettingsFields, toneField } from "./shared";

/** The photo-card grids that route visitors deeper into a property. */
export const linkCardGridSection = defineType({
  name: "linkCardGridSection",
  title: "Card grid",
  type: "object",
  fields: [
    eyebrowField,
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "items",
      title: "Cards",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "linkCard",
          title: "Card",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "href",
              title: "Destination",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "image",
              title: "Image",
              type: "imageWithAlt",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "inScope",
              title: "This page exists on the site",
              type: "boolean",
              initialValue: true,
              description: "Turn off to show the card without linking anywhere.",
            }),
          ],
          preview: { select: { title: "label", subtitle: "href", media: "image" } },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "columns",
      title: "Columns",
      type: "number",
      options: {
        layout: "radio",
        list: [
          { title: "Two", value: 2 },
          { title: "Three", value: 3 },
          { title: "Four", value: 4 },
        ],
      },
      initialValue: 3,
      validation: (Rule) => Rule.required(),
    }),
    toneField,
    ...sectionSettingsFields,
  ],
  preview: {
    select: { title: "heading", items: "items", media: "items.0.image" },
    prepare: ({ title, items, media }) => ({
      title: title || "Card grid",
      subtitle: `${items?.length ?? 0} card${items?.length === 1 ? "" : "s"}`,
      media,
    }),
  },
});
