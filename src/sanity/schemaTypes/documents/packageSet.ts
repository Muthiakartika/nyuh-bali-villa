import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * A named group of packages, published once and referenced from every page
 * that shows it.
 *
 * src/data/packages.ts exists for exactly this reason: the Ubud romance
 * packages appear on two routes — the Offers page's Romance tab and the
 * Romance page itself — "with identical copy. Declaring them once means a
 * wording change lands on both routes." A referenced set keeps that property
 * once an editor owns the copy.
 */
export const packageSet = defineType({
  name: "packageSet",
  title: "Package set",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "slug",
      title: "Reference name",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "property",
      title: "Property",
      type: "string",
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
      name: "alwaysIncluded",
      title: "Always included",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description:
        "Appended to every package in this set, so the lists cannot drift apart. This is what UBUD_ALWAYS_INCLUDED does in src/data/packages.ts.",
    }),
    defineField({
      name: "packages",
      title: "Packages",
      type: "array",
      of: [defineArrayMember({ type: "packageItem" })],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "property", packages: "packages" },
    prepare: ({ title, subtitle, packages }) => ({
      title,
      subtitle: `${subtitle ?? ""} · ${packages?.length ?? 0} package${
        packages?.length === 1 ? "" : "s"
      }`,
    }),
  },
});
