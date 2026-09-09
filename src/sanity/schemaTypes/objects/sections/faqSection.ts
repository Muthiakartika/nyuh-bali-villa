import { defineArrayMember, defineField, defineType } from "sanity";
import { sectionSettingsFields, toneField } from "./shared";

export const faqSection = defineType({
  name: "faqSection",
  title: "FAQ",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description: 'The live pages vary — "FAQ" on the yoga page, "Frequently Asked Questions" on the slimming page.',
      initialValue: "FAQ",
    }),
    defineField({
      name: "faqs",
      title: "Questions",
      type: "array",
      of: [defineArrayMember({ type: "faqItem" })],
      validation: (Rule) => Rule.required().min(1),
    }),
    toneField,
    ...sectionSettingsFields,
  ],
  preview: {
    select: { title: "heading", faqs: "faqs" },
    prepare: ({ title, faqs }) => ({
      title: title || "FAQ",
      subtitle: `${faqs?.length ?? 0} question${faqs?.length === 1 ? "" : "s"}`,
    }),
  },
});
