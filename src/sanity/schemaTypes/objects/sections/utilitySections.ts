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
      name: "feed",
      title: "Which account",
      type: "string",
      options: {
        list: [
          { title: "Seminyak resort (@nyuhbalivillas)", value: "seminyak" },
          { title: "Ubud resort (@nyuhbaliubud)", value: "ubud" },
          { title: "Mahamaya Spa (@mahamayaspa.ubud)", value: "spa" },
        ],
        layout: "radio",
      },
      // A feed key, not a URL. The grid fetches it in the browser, and the
      // feed service sends no CORS headers — so it can only ever call this
      // site's own /api/instagram/<key> proxy, never the feed directly. The
      // field this replaces was a `url`, which could not have worked.
      //
      // Empty means "this property's own account", which is right on the two
      // About pages and wrong on exactly one page: /ubud/spa is an Ubud page,
      // so the default resolved to the resort's feed and published
      // @nyuhbaliubud's posts under the spa's heading.
      description:
        "Leave empty to use this property's own account. Set it only where the band belongs to a different account than the page's property — /ubud/spa is the one such page.",
    }),
    defineField({
      name: "profileUrl",
      title: "Profile link",
      type: "url",
      // The "Follow on Instagram" button and the fallback permalink on every
      // tile. It has to move with `feed`: on /ubud/spa the button pointed at
      // @nyuhbaliubud while the heading above it said @mahamayaspa.ubud.
      description:
        "Leave empty to use this property's own Instagram. Set it wherever 'Which account' is set, so the button matches the posts.",
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
