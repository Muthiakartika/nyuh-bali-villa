import { defineArrayMember, defineField, defineType } from "sanity";
import { eyebrowField, sectionSettingsFields, toneField } from "./shared";

/** The awards strip. Seminyak lays its badges out as a grid, Ubud as a marquee. */
export const awardsSection = defineType({
  name: "awardsSection",
  title: "Awards",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({
      name: "badges",
      title: "Badges",
      type: "array",
      of: [defineArrayMember({ type: "imageWithAlt" })],
      validation: (Rule) => Rule.required().min(1),
      options: { layout: "grid" },
    }),
    defineField({
      name: "variant",
      title: "Layout",
      type: "string",
      options: {
        layout: "radio",
        list: [
          { title: "Static row", value: "grid" },
          { title: "Scrolling marquee", value: "marquee" },
        ],
      },
      initialValue: "grid",
    }),
    ...sectionSettingsFields,
  ],
  preview: {
    select: { title: "heading", badges: "badges", media: "badges.0" },
    prepare: ({ title, badges, media }) => ({
      title: title || "Awards",
      subtitle: `${badges?.length ?? 0} badge${badges?.length === 1 ? "" : "s"}`,
      media,
    }),
  },
});

/** The direct-booking benefits panel. */
export const dealsSection = defineType({
  name: "dealsSection",
  title: "Direct booking deals",
  type: "object",
  fields: [
    defineField({
      name: "bookingHref",
      title: "Booking destination",
      type: "string",
      description: "Leave empty to use the property's own booking link.",
    }),
    ...sectionSettingsFields,
  ],
  preview: {
    prepare: () => ({ title: "Direct booking deals" }),
  },
});

/** The Instagram teaser strip. */
export const instagramSection = defineType({
  name: "instagramSection",
  title: "Instagram",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({
      name: "feedUrl",
      title: "Feed URL",
      type: "url",
      description: "Leave empty to use the property's own feed.",
    }),
    ...sectionSettingsFields,
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title || "Instagram" }),
  },
});

/** The booking-engine widget band. */
export const bookingWidgetSection = defineType({
  name: "bookingWidgetSection",
  title: "Booking widget",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({
      name: "widgetId",
      title: "Widget ID",
      type: "string",
      description: "Leave empty to use the property's own widget.",
    }),
    ...sectionSettingsFields,
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title || "Booking widget" }),
  },
});

/** A plain bullet band — an experience page's "Inclusions" or "Recommended for". */
export const bulletListSection = defineType({
  name: "bulletListSection",
  title: "Bullet list",
  type: "object",
  fields: [
    eyebrowField,
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 3 }),
    defineField({
      name: "groups",
      title: "Bullet groups",
      type: "array",
      of: [defineArrayMember({ type: "bulletGroup" })],
      validation: (Rule) => Rule.required().min(1),
    }),
    toneField,
    ...sectionSettingsFields,
  ],
  preview: {
    select: { title: "heading", groups: "groups" },
    prepare: ({ title, groups }) => ({
      title: title || "Bullet list",
      subtitle: `${groups?.length ?? 0} group${groups?.length === 1 ? "" : "s"}`,
    }),
  },
});

/** A rate table published as its own band. */
export const priceTableSection = defineType({
  name: "priceTableSection",
  title: "Rate table",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({
      name: "table",
      title: "Table",
      type: "priceTable",
      validation: (Rule) => Rule.required(),
    }),
    toneField,
    ...sectionSettingsFields,
  ],
  preview: {
    select: { title: "heading", columns: "table.columns" },
    prepare: ({ title, columns }) => ({
      title: title || "Rate table",
      subtitle: (columns ?? []).join(" · "),
    }),
  },
});
