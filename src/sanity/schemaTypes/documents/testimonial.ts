import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "property",
      title: "Property",
      type: "string",
      options: {
        layout: "radio",
        list: [
          { title: "Seminyak", value: "seminyak" },
          { title: "Ubud", value: "ubud" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Lower numbers appear first in the carousel.",
      validation: (Rule) => Rule.integer(),
    }),
  ],
  preview: {
    select: { title: "author", subtitle: "quote", property: "property" },
    prepare: ({ title, subtitle, property }) => ({
      title: `${title}${property ? ` (${property})` : ""}`,
      subtitle,
    }),
  },
  orderings: [
    { title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
});
