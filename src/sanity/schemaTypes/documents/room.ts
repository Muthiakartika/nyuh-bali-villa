import { defineArrayMember, defineField, defineType } from "sanity";

/** Mirrors `RoomDetail` in src/data/rooms.ts. */
export const room = defineType({
  name: "room",
  title: "Room or villa",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "specification", title: "Specification" },
    { name: "media", title: "Media" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Name",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      group: "content",
      description: "The segment under /seminyak/villa/ or /ubud/villa/.",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "property",
      title: "Property",
      type: "string",
      group: "content",
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
      name: "description",
      title: "Description",
      type: "text",
      rows: 5,
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "details",
      title: "Specification",
      type: "array",
      group: "specification",
      of: [defineArrayMember({ type: "detailRow" })],
      description: "Size, occupancy, bed type — the label/value table beside the gallery.",
    }),
    defineField({
      name: "amenities",
      title: "Amenities",
      type: "array",
      group: "specification",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "facilities",
      title: "Facilities",
      type: "array",
      group: "specification",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "hero",
      title: "Hero image",
      type: "imageWithAlt",
      group: "media",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      group: "media",
      of: [defineArrayMember({ type: "imageWithAlt" })],
      options: { layout: "grid" },
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      group: "content",
      description: "Lower numbers appear first in the villa list.",
      validation: (Rule) => Rule.integer(),
    }),
    defineField({ name: "seo", title: "Search and social", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { title: "title", subtitle: "property", media: "hero" },
  },
  orderings: [
    {
      title: "Property, then order",
      name: "propertyOrder",
      by: [
        { field: "property", direction: "asc" },
        { field: "order", direction: "asc" },
      ],
    },
  ],
});
