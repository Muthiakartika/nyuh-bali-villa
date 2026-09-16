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
      description: "Select any words to make them bold, italic or a link. Press Return for a new paragraph; the style menu adds subheadings, quotes and lists. The layout stays the band's — formatting is inline only.",
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
