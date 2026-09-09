import { defineField, defineType } from "sanity";
import { eyebrowField, sectionSettingsFields, toneField } from "./shared";

export const richTextSection = defineType({
  name: "richTextSection",
  title: "Rich text",
  type: "object",
  fields: [
    eyebrowField,
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({
      name: "body",
      title: "Body",
      type: "portableText",
      validation: (Rule) => Rule.required(),
    }),
    toneField,
    ...sectionSettingsFields,
  ],
  preview: {
    select: { title: "heading", subtitle: "eyebrow" },
    prepare: ({ title, subtitle }) => ({
      title: title || "Rich text",
      subtitle: subtitle || "Rich text",
    }),
  },
});
