import { defineArrayMember, defineField, defineType } from "sanity";
import { eyebrowField, sectionSettingsFields, toneField } from "./shared";

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
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 5 })],
      description: "One entry per paragraph.",
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
    ...sectionSettingsFields,
  ],
  preview: {
    select: { title: "heading", subtitle: "eyebrow", media: "image" },
  },
});
