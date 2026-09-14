import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Everything the site says that belongs to neither one page nor one property:
 * the footer's own wording, the legal links, the site-wide search defaults.
 *
 * ── EVERY FIELD IS OPTIONAL, ON PURPOSE ───────────────────────────────
 * Each one falls back to the value it replaces in `src/data` or in the
 * component itself. An empty field therefore renders exactly what the site
 * rendered before, which is what makes this safe to ship without migrating
 * first, and what stops a half-finished edit from blanking the footer of all
 * 78 pages.
 *
 * ── AND EVERY FIELD IS NOW READ ───────────────────────────────────────
 * It was not. Before this pass `getSiteSettings()` existed and nothing ever
 * called it, so an editor could fill this document in and watch the website
 * ignore all of it — a worse state than having no document, because it looks
 * like it works. `PropertyFooter`, `BookNowRibbon` and the root layout read
 * it now; anything added here needs a reader before it is worth adding.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "brand", title: "Brand", default: true },
    { name: "offer", title: "Booking offer" },
    { name: "footer", title: "Footer" },
    { name: "seo", title: "Search defaults" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Site name",
      type: "string",
      group: "brand",
      initialValue: "Nyuh Bali Villas",
      description: "Used as the fallback browser-tab title and as the Open Graph site name.",
    }),
    defineField({
      name: "description",
      title: "Site description",
      type: "text",
      rows: 3,
      group: "brand",
      description:
        "The fallback meta description. Fifteen live routes publish none of their own and inherit this.",
    }),
    defineField({
      name: "bookNowLabel",
      title: "Book Now tab label",
      type: "string",
      group: "brand",
      description:
        'The vertical tab down the right edge of the homepage. One word per line, so keep it to two short words — "BOOK NOW" is the default.',
      validation: (Rule) => Rule.max(24),
    }),
    defineField({
      name: "dealHeadline",
      title: "Offer line",
      type: "string",
      group: "offer",
      description:
        'The bar docked to the bottom of every page. Empty reads "Direct Booking Deals 66% Off".',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: "dealCode",
      title: "Promo code line",
      type: "string",
      group: "offer",
      description:
        'Set in gold under the offer line — the whole line, not just the code, so it can read Code : "ilovenyuh". Empty leaves the line out; clear it to run an offer with no code.',
      validation: (Rule) => Rule.max(40),
    }),
    defineField({
      name: "dealButtonLabel",
      title: "Offer button label",
      type: "string",
      group: "offer",
      description:
        'Empty reads "Book Now". It always points at the booking engine of whichever property the page belongs to.',
      validation: (Rule) => Rule.max(30),
    }),
    defineField({
      name: "footerLogo",
      title: "Footer logo",
      type: "imageWithAlt",
      group: "footer",
      description:
        "The wordmark in the footer's first column. Empty uses the one the site ships with.",
    }),
    defineField({
      name: "footerBookingLabel",
      title: "Footer button label",
      type: "string",
      group: "footer",
      description: 'The button under the logo. Empty reads "Book Now". It always points at the property\'s own booking engine.',
      validation: (Rule) => Rule.max(30),
    }),
    defineField({
      name: "footerMenuHeading",
      title: "Menu column heading",
      type: "string",
      group: "footer",
      description: 'The gold label over the footer\'s link list. Empty reads "Nyuh Bali Villas".',
    }),
    defineField({
      name: "footerMenuLinks",
      title: "Menu column links",
      type: "array",
      group: "footer",
      of: [defineArrayMember({ type: "link" })],
      description:
        "Empty lists this property's own About, Villas, Offers, Blog and Contact, as it does today. Fill it in to choose the links yourself — they are the same for both properties, so write paths that suit both or leave it empty.",
    }),
    defineField({
      name: "footerBlogHeading",
      title: "Blog column heading",
      type: "string",
      group: "footer",
      description: 'The gold label over the recent-posts list. Empty reads "Our Blog".',
    }),
    defineField({
      name: "footerNote",
      title: "Copyright line",
      type: "string",
      group: "footer",
      description:
        'The line beside the year at the very bottom. Empty reads "All Rights Reserved". The year itself is always the current one and is added automatically.',
    }),
    defineField({
      name: "legalLinks",
      title: "Legal links",
      type: "array",
      group: "footer",
      of: [defineArrayMember({ type: "link" })],
      description:
        "The small links beside the copyright. Empty shows Terms & Conditions and Privacy & Policy, as it does today.",
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: "favicon",
      title: "Favicon",
      type: "imageWithAlt",
      group: "brand",
      description: "The small icon in the browser tab. Square, at least 48 × 48.",
    }),
    defineField({ name: "defaultSeo", title: "Default SEO", type: "seo", group: "seo" }),
  ],
  preview: {
    prepare: () => ({ title: "Site settings", subtitle: "Footer, brand and search defaults" }),
  },
});
