import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * One of the two resorts, mirroring `PropertySite` in src/data/properties.ts.
 *
 * The data file is emphatic that these are genuinely two sites, not one site
 * with a name swapped in: each runs its own accounts, sits at its own address
 * about 40km away, links a different Offers page, and shows a different award
 * set in a different layout. Every one of those is a field here rather than
 * something derived from the slug, for the same reason it is a field there —
 * deriving it is what once sent every Ubud page to Seminyak's map pin.
 *
 * Grouped into tabs because a flat list of thirty fields spanning navigation,
 * addresses, booking tokens and award badges is not editable in any
 * meaningful sense.
 */

const navChild = defineArrayMember({
  type: "object",
  name: "navChild",
  title: "Submenu item",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "href",
      title: "Destination",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "inScope",
      title: "This page exists on the site",
      type: "boolean",
      initialValue: true,
      description: "Turn off to show the label without linking anywhere.",
    }),
    defineField({
      name: "external",
      title: "Open in a new tab",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});

export const property = defineType({
  name: "property",
  title: "Property",
  type: "document",
  groups: [
    { name: "brand", title: "Brand", default: true },
    { name: "navigation", title: "Navigation" },
    { name: "contact", title: "Contact & social" },
    { name: "booking", title: "Booking" },
    { name: "footer", title: "Footer" },
  ],
  fields: [
    // ── Brand ─────────────────────────────────────────────────────────
    defineField({
      name: "slug",
      title: "Property",
      type: "string",
      group: "brand",
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
      name: "label",
      title: "Display name",
      type: "string",
      group: "brand",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "logo", title: "Logo", type: "imageWithAlt", group: "brand" }),

    // ── Navigation ────────────────────────────────────────────────────
    defineField({
      name: "navItems",
      title: "Main navigation",
      type: "array",
      group: "navigation",
      of: [
        defineArrayMember({
          type: "object",
          name: "navItem",
          title: "Navigation item",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "href",
              title: "Destination",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "inScope",
              title: "This page exists on the site",
              type: "boolean",
              initialValue: true,
              description: "Turn off to show the label without linking anywhere.",
            }),
            defineField({
              name: "children",
              title: "Submenu",
              type: "array",
              of: [navChild],
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "href", children: "children" },
            prepare: ({ title, subtitle, children }) => ({
              title,
              subtitle: children?.length ? `${subtitle} · ${children.length} in submenu` : subtitle,
            }),
          },
        }),
      ],
    }),

    // ── Contact & social ──────────────────────────────────────────────
    defineField({
      name: "addressLines",
      title: "Address",
      type: "array",
      group: "contact",
      of: [defineArrayMember({ type: "string" })],
      description: "One entry per line.",
    }),
    defineField({
      name: "phones",
      title: "Phone numbers",
      type: "array",
      group: "contact",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({ name: "email", title: "Email", type: "string", group: "contact" }),
    defineField({
      name: "maps",
      title: "Google Maps link",
      type: "url",
      group: "contact",
      description: "This property's own pin. The two resorts are about 40km apart.",
    }),
    defineField({ name: "facebook", title: "Facebook", type: "url", group: "contact" }),
    defineField({ name: "instagram", title: "Instagram", type: "url", group: "contact" }),
    defineField({
      name: "instagramApiUrl",
      title: "Instagram feed API",
      type: "url",
      group: "contact",
      description:
        "The workspace feed endpoint for the live Instagram grid. Editable here rather than in an env file because a tunnelled URL changes often — publishing a new one takes effect within a minute, with no restart or redeploy.",
    }),
    defineField({
      name: "spaInstagramApiUrl",
      title: "Mahamaya Spa Instagram feed API",
      type: "url",
      group: "contact",
      // Ubud only: the spa is Ubud's, and @mahamayaspa.ubud is a third account
      // alongside the two resorts'. It lives on this document rather than on a
      // document of its own because there is no "spa property" — /ubud/spa is
      // an Ubud page wearing Ubud's chrome.
      hidden: ({ document }) => document?.slug !== "ubud",
      description:
        "The workspace feed endpoint for the Mahamaya Spa grid on /ubud/spa. A separate account from the resort's, so it needs its own endpoint — pointing it at the resort feed would publish the resort's posts under the spa's name.",
    }),
    defineField({
      name: "instagramFeedUrl",
      title: "Behold feed URL",
      type: "url",
      group: "contact",
      description:
        "https://feeds.behold.so/<id>, from the Behold dashboard. Empty means no live grid — the page falls back to whatever it showed before.",
    }),

    // ── Booking ───────────────────────────────────────────────────────
    defineField({
      name: "bookingHref",
      title: "Booking link",
      type: "url",
      group: "booking",
      description: "This property's booking-engine URL, including its own propertyId.",
    }),
    defineField({
      name: "bookingWidgetId",
      title: "Booking widget token",
      type: "string",
      group: "booking",
      description:
        "NOT the same string as the propertyId inside the booking link — the widget and the deep link use different tokens for the same property. Copy both from the live site's own embed.",
    }),
    defineField({
      name: "offersHref",
      title: "Offers page",
      type: "string",
      group: "booking",
      description:
        "The two differ: Seminyak's is nested under the honeymoon villa, Ubud's is top-level, so it cannot be derived from the slug.",
    }),

    // ── Footer ────────────────────────────────────────────────────────
    defineField({
      name: "blogPosts",
      title: "Footer blog teaser",
      type: "array",
      group: "footer",
      of: [
        defineArrayMember({
          type: "object",
          name: "blogTeaser",
          title: "Post",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "href",
              title: "Destination",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: { select: { title: "title", subtitle: "href" } },
        }),
      ],
      description: "The exact posts this property links to. The two blogs are entirely separate.",
    }),
    defineField({
      name: "awardBadges",
      title: "Award badges",
      type: "array",
      group: "footer",
      of: [defineArrayMember({ type: "imageWithAlt" })],
      options: { layout: "grid" },
    }),
    defineField({
      name: "awardVariant",
      title: "Award layout",
      type: "string",
      group: "footer",
      options: {
        layout: "radio",
        list: [
          { title: "Static row", value: "grid" },
          { title: "Scrolling marquee", value: "marquee" },
        ],
      },
      initialValue: "grid",
      description: "Seminyak is a static grid; Ubud is a marquee.",
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "slug", media: "logo" },
  },
});
