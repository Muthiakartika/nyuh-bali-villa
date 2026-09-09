import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Terms & Conditions and Privacy Policy. Mirrors `LegalSection` in
 * src/data/legal.ts — a heading plus either a paragraph or a list.
 *
 * Both render with Ubud's header and footer regardless of which property a
 * visitor came from, and neither shows the direct-booking widget. That is
 * the live site's own behaviour, replicated rather than tidied, so the
 * property is fixed here rather than being an editor's choice.
 */
export const legalPage = defineType({
  name: "legalPage",
  title: "Legal page",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "path",
      title: "Website path",
      type: "string",
      group: "content",
      options: {
        list: [
          { title: "/terms-conditions", value: "/terms-conditions" },
          { title: "/privacy-policy", value: "/privacy-policy" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 3,
      group: "content",
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          name: "legalParagraph",
          title: "Paragraph section",
          fields: [
            defineField({
              name: "heading",
              title: "Heading",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "text",
              title: "Text",
              type: "text",
              rows: 5,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "heading", subtitle: "text" },
            prepare: ({ title, subtitle }) => ({ title, subtitle: subtitle || "Paragraph" }),
          },
        }),
        defineArrayMember({
          type: "object",
          name: "legalList",
          title: "List section",
          fields: [
            defineField({
              name: "heading",
              title: "Heading",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "items",
              title: "Items",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: {
            select: { title: "heading", items: "items" },
            prepare: ({ title, items }) => ({
              title,
              subtitle: `${items?.length ?? 0} item${items?.length === 1 ? "" : "s"}`,
            }),
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "updatedAt",
      title: "Last updated",
      type: "date",
      group: "content",
      options: { dateFormat: "YYYY-MM-DD" },
    }),
    defineField({ name: "seo", title: "Search and social", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { title: "title", subtitle: "path" },
  },
});
