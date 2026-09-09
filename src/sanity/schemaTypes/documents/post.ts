import { defineArrayMember, defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Blog post",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "details", title: "Publishing" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: "path",
      title: "Website path",
      type: "string",
      group: "details",
      description: "The full path, e.g. /ubud/discover/hatha-yoga.",
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value) return true;
          if (!value.startsWith("/")) return "The path must begin with /.";
          if (value.length > 1 && value.endsWith("/")) return "Remove the trailing /.";
          return true;
        }),
    }),
    defineField({
      name: "property",
      title: "Property",
      type: "string",
      group: "details",
      options: {
        layout: "radio",
        list: [
          { title: "Seminyak", value: "seminyak" },
          { title: "Ubud", value: "ubud" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "date",
      title: "Publication date",
      type: "date",
      group: "details",
      options: { dateFormat: "YYYY-MM-DD" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      group: "details",
      description:
        "Breaks ties between posts published on the same day. Lower appears first.",
      validation: (Rule) => Rule.integer(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      group: "content",
      description: "Shown on the Discover index cards.",
      validation: (Rule) => Rule.required().max(320),
    }),
    defineField({
      name: "image",
      title: "Featured image",
      type: "imageWithAlt",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      group: "details",
      of: [defineArrayMember({ type: "reference", to: [{ type: "category" }] })],
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: "blocks",
      title: "Article body",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({ type: "articleHeading" }),
        defineArrayMember({ type: "articleParagraph" }),
        defineArrayMember({ type: "articleList" }),
        defineArrayMember({ type: "articleImage" }),
        defineArrayMember({ type: "articlePoints" }),
        defineArrayMember({ type: "articlePrice" }),
        defineArrayMember({ type: "articleFaq" }),
      ],
      validation: (Rule) => Rule.required().min(1),
      options: { insertMenu: { views: [{ name: "list" }] } },
    }),
    defineField({ name: "seo", title: "Search and social", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { title: "title", subtitle: "path", media: "image", date: "date" },
    prepare: ({ title, subtitle, media, date }) => ({
      title,
      subtitle: [date, subtitle].filter(Boolean).join(" · "),
      media,
    }),
  },
  orderings: [
    {
      title: "Publication date, newest",
      name: "dateDesc",
      by: [
        { field: "date", direction: "desc" },
        { field: "order", direction: "asc" },
      ],
    },
    {
      title: "Website path",
      name: "pathAsc",
      by: [{ field: "path", direction: "asc" }],
    },
  ],
});
