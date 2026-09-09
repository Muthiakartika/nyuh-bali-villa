import { defineArrayMember, defineField, defineType } from "sanity";
import { sectionSettingsFields, toneField } from "./shared";

/** The "Available Programs" accordion — length-of-stay tiers. */
export const programListSection = defineType({
  name: "programListSection",
  title: "Programme tiers",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Available Programs",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tiers",
      title: "Tiers",
      type: "array",
      of: [defineArrayMember({ type: "experienceProgram" })],
      validation: (Rule) => Rule.required().min(1),
    }),
    toneField,
    ...sectionSettingsFields,
  ],
  preview: {
    select: { title: "heading", tiers: "tiers" },
    prepare: ({ title, tiers }) => ({
      title: title || "Programme tiers",
      subtitle: `${tiers?.length ?? 0} tier${tiers?.length === 1 ? "" : "s"}`,
    }),
  },
});
