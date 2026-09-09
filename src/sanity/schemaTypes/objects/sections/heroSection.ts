import { defineArrayMember, defineField, defineType } from "sanity";
import { sectionSettingsFields } from "./shared";

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero",
  type: "object",
  fields: [
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [defineArrayMember({ type: "imageWithAlt" })],
      description: "More than one image turns the hero into a slideshow.",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description: "The brand line above the property name.",
    }),
    defineField({
      name: "title",
      title: "Heading",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "alt",
      title: "Image description",
      type: "string",
      description: "One alt string for the whole set — every slide shows the same subject.",
    }),
    ...sectionSettingsFields,
  ],
  preview: {
    select: { title: "title", subtitle: "eyebrow", media: "images.0" },
    prepare: ({ title, subtitle, media }) => ({
      title: title || "Untitled hero",
      subtitle: subtitle || "Hero",
      media,
    }),
  },
});
