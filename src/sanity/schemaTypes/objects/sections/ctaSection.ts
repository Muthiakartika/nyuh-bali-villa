import { defineArrayMember, defineField, defineType } from "sanity";
import { eyebrowField, sectionSettingsFields, toneField } from "./shared";

export const ctaSection = defineType({
  name: "ctaSection",
  title: "Call to action",
  type: "object",
  fields: [
    eyebrowField,
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
    defineField({
      name: "actions",
      title: "Actions",
      type: "array",
      of: [defineArrayMember({ type: "link" })],
      validation: (Rule) => Rule.max(2),
    }),
    defineField({ name: "image", title: "Background image", type: "imageWithAlt" }),
    toneField,
    ...sectionSettingsFields,
  ],
  preview: {
    select: { title: "heading", subtitle: "body", media: "image" },
  },
});
