import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * The `BulletGroup` in src/data/experiences.ts — an optional heading over a
 * plain list. Every retreat programme tier is built from these, and so are
 * the slimming page's "The Benefit of…" and "What's Included?" blocks.
 */
export const bulletGroup = defineType({
  name: "bulletGroup",
  title: "Bullet group",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description: 'Optional — "Retreat Exclusive", "Complimentary".',
    }),
    defineField({
      name: "items",
      title: "Bullets",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "heading", items: "items" },
    prepare: ({ title, items }) => ({
      title: title || "Untitled group",
      subtitle: `${items?.length ?? 0} bullet${items?.length === 1 ? "" : "s"}`,
    }),
  },
});
