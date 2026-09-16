import { defineField, defineType } from "sanity";
import { eyebrowField, headingLevelField, sectionSettingsFields, toneField } from "./shared";

/** The About narrative band — prose beside a photograph. */
export const splitContentSection = defineType({
  name: "splitContentSection",
  title: "Text with image",
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
      name: "paragraphs",
      title: "Paragraphs",
      type: "proseRichText",
      description: "Select any words to make them bold, italic or a link. Press Return for a new paragraph; the style menu adds subheadings, quotes and lists. The layout stays the band's — formatting is inline only.",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "script",
      title: "Handwritten line",
      type: "string",
      description: 'The one quoted line set in the script face — "We serve with smile and sincerity".',
    }),
    defineField({ name: "image", title: "Image", type: "imageWithAlt" }),
    defineField({
      name: "imageSide",
      title: "Image position",
      type: "string",
      options: {
        layout: "radio",
        list: [
          { title: "Right of the text", value: "right" },
          { title: "Left of the text", value: "left" },
        ],
      },
      initialValue: "right",
    }),
    defineField({ name: "action", title: "Action", type: "link" }),
    toneField,
    headingLevelField,
    ...sectionSettingsFields,
  ],
  preview: {
    select: { title: "heading", subtitle: "eyebrow", media: "image" },
  },
});
