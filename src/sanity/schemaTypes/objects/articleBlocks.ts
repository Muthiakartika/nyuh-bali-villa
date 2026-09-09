import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * The article body, modelled as the `ArticleBlock` union in
 * src/components/property/postBlocks.ts rather than as portable text.
 *
 * That file states the reason itself: the union "is the contract for the
 * coming CRUD. An editor should emit these shapes directly". Its three
 * recovery passes exist only because the seventeen imported posts arrived
 * from WordPress with their structure flattened into paragraphs — a listicle
 * rendered as a wall of text, 88 question/answer pairs rendered as short
 * paragraphs, a rate table serialised column by column. Authoring `points`,
 * `faq` and `price` directly means the recovery passes see already-correct
 * blocks and let them through untouched, which is exactly what they are
 * written to do.
 *
 * Portable text would have meant flattening back down to paragraphs on the
 * way out and asking the recovery heuristics to guess the structure again.
 */

export const articleHeading = defineType({
  name: "articleHeading",
  title: "Heading",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Text",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "text" },
    prepare: ({ title }) => ({ title, subtitle: "Heading" }),
  },
});

export const articleParagraph = defineType({
  name: "articleParagraph",
  title: "Paragraph",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Text",
      type: "text",
      rows: 5,
      description:
        "Link with [link:https://example.com]word — the word after the marker becomes the link text.",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "text" },
    prepare: ({ title }) => ({ title, subtitle: "Paragraph" }),
  },
});

export const articleList = defineType({
  name: "articleList",
  title: "Bulleted list",
  type: "object",
  fields: [
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { items: "items" },
    prepare: ({ items }) => ({
      title: (items ?? []).join(" · ") || "Empty list",
      subtitle: "List",
    }),
  },
});

export const articleImage = defineType({
  name: "articleImage",
  title: "Image",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "imageWithAlt",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "image.alt", media: "image" },
    prepare: ({ title, media }) => ({ title: title || "Image", subtitle: "Image", media }),
  },
});

/** One entry of a titled point list: a label plus its own body blocks. */
export const articlePointItem = defineType({
  name: "articlePointItem",
  title: "Point",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        defineArrayMember({ type: "articleParagraph" }),
        defineArrayMember({ type: "articleImage" }),
      ],
      description: "The paragraphs, and any illustration, that belong to this point.",
    }),
  ],
  preview: {
    select: { title: "label", body: "body" },
    prepare: ({ title, body }) => ({
      title,
      subtitle: `${body?.length ?? 0} block${body?.length === 1 ? "" : "s"}`,
    }),
  },
});

export const articlePoints = defineType({
  name: "articlePoints",
  title: "Point list",
  type: "object",
  fields: [
    defineField({
      name: "ordered",
      title: "Numbered",
      type: "boolean",
      initialValue: false,
      description: "Numbered runs show the item's number; unnumbered runs show a gold rule.",
    }),
    defineField({
      name: "items",
      title: "Points",
      type: "array",
      of: [defineArrayMember({ type: "articlePointItem" })],
      validation: (Rule) =>
        Rule.required()
          .min(2)
          .warning("A single point renders as an ordinary paragraph, not a list."),
    }),
  ],
  preview: {
    select: { items: "items", ordered: "ordered" },
    prepare: ({ items, ordered }) => ({
      title: `${items?.length ?? 0} point${items?.length === 1 ? "" : "s"}`,
      subtitle: ordered ? "Numbered list" : "Point list",
    }),
  },
});

export const articleFaq = defineType({
  name: "articleFaq",
  title: "FAQ",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "FAQ",
      description: 'The live posts vary — "FAQ", "Find Your Answer", "Learn More".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "items",
      title: "Questions",
      type: "array",
      of: [defineArrayMember({ type: "faqItem" })],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "heading", items: "items" },
    prepare: ({ title, items }) => ({
      title: title || "FAQ",
      subtitle: `${items?.length ?? 0} question${items?.length === 1 ? "" : "s"}`,
    }),
  },
});

export const articlePrice = defineType({
  name: "articlePrice",
  title: "Rate table",
  type: "object",
  fields: [
    defineField({
      name: "table",
      title: "Table",
      type: "priceTable",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { columns: "table.columns", rows: "table.rows" },
    prepare: ({ columns, rows }) => ({
      title: (columns ?? []).join(" · ") || "Rate table",
      subtitle: `Rate table · ${rows?.length ?? 0} row${rows?.length === 1 ? "" : "s"}`,
    }),
  },
});
