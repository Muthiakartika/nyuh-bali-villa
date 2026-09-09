import { defineField, defineType } from "sanity";

/**
 * The site renders FAQ answers as plain strings (see FaqEntry in
 * FaqAccordion), so this stays a text field rather than portable text —
 * the fetch layer would only have to flatten it back again.
 */
export const faqItem = defineType({
  name: "faqItem",
  title: "Question and answer",
  type: "object",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: { select: { title: "question", subtitle: "answer" } },
});
