import { defineArrayMember, defineField, defineType } from "sanity";
import { eyebrowField, headingLevelField, sectionSettingsFields, toneField } from "./shared";

export const treatmentListSection = defineType({
  name: "treatmentListSection",
  title: "Spa menu",
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
      name: "intro",
      title: "Intro",
      type: "proseRichText",
      description: "Select any words to make them bold, italic or a link. Press Return for a new paragraph; the style menu adds subheadings, quotes and lists. The layout stays the band's — formatting is inline only.",
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description: "Short facts under the intro — opening hours, the early-booking discount.",
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [defineArrayMember({ type: "treatmentCategory" })],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({ name: "cta", title: "Closing action", type: "link" }),
    toneField,
    headingLevelField,
    ...sectionSettingsFields,
  ],
  preview: {
    select: { title: "heading", categories: "categories" },
    prepare: ({ title, categories }) => ({
      title: title || "Spa menu",
      subtitle: `${categories?.length ?? 0} categor${categories?.length === 1 ? "y" : "ies"}`,
    }),
  },
});
