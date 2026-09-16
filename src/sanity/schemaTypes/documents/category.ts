import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Blog category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "What belongs in this category (internal)",
      type: "text",
      rows: 2,
      description:
        "A note for whoever tags the posts. It is not shown on the website — the blog renders a category as its name alone, in the meta row above each headline.",
    }),
  ],
  preview: { select: { title: "title", subtitle: "slug.current" } },
  orderings: [
    { title: "Title", name: "titleAsc", by: [{ field: "title", direction: "asc" }] },
  ],
});
