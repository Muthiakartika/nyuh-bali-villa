import { defineArrayMember, defineField, defineType } from "sanity";

/** Structured facts shown above a package's description — Price, Duration, Itinerary. */
export const packageMeta = defineType({
  name: "packageMeta",
  title: "Fact",
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
  preview: { select: { title: "label", subtitle: "value" } },
});

/** Mirrors `PackageItem` in PackageList.tsx, field for field. */
export const packageItem = defineType({
  name: "packageItem",
  title: "Package",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [defineArrayMember({ type: "imageWithAlt" })],
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
    defineField({
      name: "meta",
      title: "Facts",
      type: "array",
      of: [defineArrayMember({ type: "packageMeta" })],
      description: "Price / Duration / Itinerary, shown above the description.",
    }),
    defineField({
      name: "benefitsHeading",
      title: "Benefits heading",
      type: "string",
      description: 'The romance pages say "Discover Benefits"; the tour pages say "Inclusions".',
    }),
    defineField({
      name: "benefits",
      title: "Benefits",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 3 })],
      description: "Free paragraphs after the list — per-stop descriptions, surcharge lines.",
    }),
    defineField({
      name: "ctas",
      title: "Actions",
      type: "array",
      of: [defineArrayMember({ type: "link" })],
      description: "Most packages have one; the dining venues have two menu PDFs.",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "description", media: "images.0" },
  },
});
