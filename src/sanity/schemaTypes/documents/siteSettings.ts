import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Everything the site says that belongs to neither one page nor one property.
 *
 * ── EVERY FIELD IS OPTIONAL, ON PURPOSE ───────────────────────────────
 * Each one falls back to the value it replaces in src/data. An empty field
 * therefore renders exactly what the site rendered before, which is what
 * makes it safe to ship this without migrating first, and what stops a
 * half-finished edit from blanking the footer of all 44 pages.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "brand", title: "Brand", default: true },
    { name: "chrome", title: "Header & footer" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Site name",
      type: "string",
      group: "brand",
      initialValue: "Nyuh Bali Villas",
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
      name: "favicon",
      title: "Favicon",
      type: "imageWithAlt",
      group: "brand",
    }),
    defineField({
      name: "bookNowLabel",
      title: "Book Now ribbon label",
      type: "string",
      group: "chrome",
    }),
    defineField({
      name: "footerNote",
      title: "Footer note",
      type: "string",
      group: "chrome",
      description: "The line beside the copyright. The year is added automatically.",
    }),
    defineField({
      name: "legalLinks",
      title: "Footer legal links",
      type: "array",
      group: "chrome",
      of: [defineArrayMember({ type: "link" })],
    }),
    defineField({ name: "defaultSeo", title: "Default SEO", type: "seo", group: "seo" }),
  ],
  preview: {
    prepare: () => ({ title: "Site settings" }),
  },
});
