import { defineArrayMember, defineField, defineType } from "sanity";

/** One bookable duration of a spa treatment, with its own price and link. */
export const treatmentOption = defineType({
  name: "treatmentOption",
  title: "Option",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: '"60 mins — IDR 490.000".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "href",
      title: "Booking destination",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});

/** Mirrors `Treatment` in TreatmentList.tsx. */
export const treatmentItem = defineType({
  name: "treatmentItem",
  title: "Treatment",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "options",
      title: "Durations and prices",
      type: "array",
      of: [defineArrayMember({ type: "treatmentOption" })],
      description: "Most treatments have one; several have two or three.",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "includes",
      title: "Package contents",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description: "Only the Ubud spa's package tiers list what they contain.",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "description" },
  },
});

/** A tab of the spa menu — "MASSAGE", "SELF INDULGENCE", "COUPLE". */
export const treatmentCategory = defineType({
  name: "treatmentCategory",
  title: "Treatment category",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Tab label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "image", title: "Image", type: "imageWithAlt" }),
    defineField({
      name: "treatments",
      title: "Treatments",
      type: "array",
      of: [defineArrayMember({ type: "treatmentItem" })],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "name", treatments: "treatments", media: "image" },
    prepare: ({ title, treatments, media }) => ({
      title,
      subtitle: `${treatments?.length ?? 0} treatment${treatments?.length === 1 ? "" : "s"}`,
      media,
    }),
  },
});
