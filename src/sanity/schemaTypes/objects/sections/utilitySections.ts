import { defineArrayMember, defineField, defineType } from "sanity";
import {
  eyebrowField,
  headingLevelField,
  hiddenOnlySettingsFields,
  sectionSettingsFields,
  toneField,
} from "./shared";

/** The awards strip. Seminyak lays its badges out as a grid, Ubud as a marquee. */
export const awardsSection = defineType({
  name: "awardsSection",
  title: "Awards",
  type: "object",
  // No heading field. The awards strip has never drawn one — `AwardsRow`
  // takes badges and a layout and nothing else — and the design closes a page
  // on this band as a silent dark base under the footer. A field here was
  // read by nothing, which is worse than absent: an editor fills it in and
  // the website ignores it. Adding the heading for real would change the
  // design, so the field goes instead.
  fields: [
    defineField({
      name: "badges",
      title: "Badges",
      type: "array",
      of: [defineArrayMember({ type: "imageWithAlt" })],
      description:
        "Leave empty to show this property's own awards, which is what every page does today. Fill it in only for a page that should show a different set.",
      options: { layout: "grid" },
    }),
    defineField({
      name: "variant",
      title: "Layout",
      type: "string",
      options: {
        layout: "radio",
        list: [
          { title: "This property's usual layout", value: "" },
          { title: "Static row", value: "grid" },
          { title: "Scrolling marquee", value: "marquee" },
        ],
      },
      initialValue: "",
      description:
        "Seminyak lays its badges out as a row and Ubud scrolls them. Leave on the first option unless this page needs the other.",
    }),
    ...hiddenOnlySettingsFields,
  ],
  preview: {
    select: { badges: "badges", media: "badges.0" },
    prepare: ({ badges, media }) => ({
      title: "Awards",
      subtitle: badges?.length
        ? `${badges.length} badge${badges.length === 1 ? "" : "s"}`
        : "This property's own awards",
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
      type: "url",
      description:
        "Leave empty to use the property's own booking link, which is what every page does today.",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "headline",
      title: "Offer line",
      type: "string",
      description: "Leave empty to use the offer set in Site settings, which is what every page shows.",
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: "code",
      title: "Promo code line",
      type: "string",
      description: "Leave empty to use Site settings'.",
      validation: (Rule) => Rule.max(40),
    }),
    defineField({
      name: "buttonLabel",
      title: "Button label",
      type: "string",
      description: "Leave empty to use Site settings'.",
      validation: (Rule) => Rule.max(30),
    }),
    ...hiddenOnlySettingsFields,
  ],
  preview: {
    select: { headline: "headline" },
    prepare: ({ headline }) => ({
      title: "Direct booking deals",
      subtitle: headline || "The offer set in Site settings",
    }),
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
  // No heading field either, and for the same reason: the booking bar is the
  // engine's own widget overlapping the hero's bottom edge, with no heading
  // in the design for one to render into.
  fields: [
    defineField({
      name: "widgetId",
      title: "Widget ID",
      type: "string",
      description: "Leave empty to use the property's own widget.",
    }),
    ...hiddenOnlySettingsFields,
  ],
  preview: {
    select: { widgetId: "widgetId" },
    prepare: ({ widgetId }) => ({
      title: "Booking widget",
      subtitle: widgetId ? "Custom widget" : "This property's own widget",
    }),
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
    defineField({
      name: "intro",
      title: "Intro",
      type: "proseRichText",
      description: "Select any words to make them bold, italic or a link. Press Return for a new paragraph; the style menu adds subheadings, quotes and lists. The layout stays the band's — formatting is inline only.",
    }),
    defineField({
      name: "groups",
      title: "Bullet groups",
      type: "array",
      of: [defineArrayMember({ type: "bulletGroup" })],
      validation: (Rule) => Rule.required().min(1),
    }),
    headingLevelField,
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
    headingLevelField,
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
