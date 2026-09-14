import { defineArrayMember, defineField, defineType } from "sanity";
import { eyebrowField, headingLevelField, sectionSettingsFields, toneField } from "./shared";

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
    defineField({
      name: "body",
      title: "Body",
      type: "proseRichText",
      description: "Paragraphs, with bold, italic, links, lists and subheadings. Each paragraph is set in this band's own type — the formatting is inline, the layout stays the band's.",
    }),
    defineField({
      name: "actions",
      title: "Actions",
      type: "array",
      of: [defineArrayMember({ type: "link" })],
      validation: (Rule) => Rule.max(2),
    }),
    defineField({ name: "image", title: "Background image", type: "imageWithAlt" }),
    toneField,
    headingLevelField,
    ...sectionSettingsFields,
  ],
  preview: {
    select: { title: "heading", subtitle: "body", media: "image" },
  },
});
