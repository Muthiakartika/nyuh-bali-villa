import { defineField, defineType } from "sanity";

/** One label/value line of a room's specification table. */
export const detailRow = defineType({
  name: "detailRow",
  title: "Detail",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "value",
      title: "Value",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "value" },
  },
});
