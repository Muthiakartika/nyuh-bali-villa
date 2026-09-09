import { defineArrayMember, defineField, defineType } from "sanity";
import { eyebrowField, sectionSettingsFields, toneField } from "./shared";

export const packageListSection = defineType({
  name: "packageListSection",
  title: "Packages",
  type: "object",
  fields: [
    eyebrowField,
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 3 }),
    defineField({
      name: "source",
      title: "Where the packages come from",
      type: "string",
      options: {
        layout: "radio",
        list: [
          { title: "Written here", value: "inline" },
          { title: "A published package set", value: "reference" },
        ],
      },
      initialValue: "inline",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "packages",
      title: "Packages",
      type: "array",
      of: [defineArrayMember({ type: "packageItem" })],
      hidden: ({ parent }) => parent?.source !== "inline",
    }),
    defineField({
      name: "packageSet",
      title: "Package set",
      type: "reference",
      to: [{ type: "packageSet" }],
      description:
        "The Ubud romance packages appear on two routes with identical copy — referencing one set means a wording change lands on both.",
      hidden: ({ parent }) => parent?.source !== "reference",
    }),
    toneField,
    ...sectionSettingsFields,
  ],
  preview: {
    select: { title: "heading", packages: "packages", set: "packageSet.title" },
    prepare: ({ title, packages, set }) => ({
      title: title || "Packages",
      subtitle: set
        ? `From set: ${set}`
        : `${packages?.length ?? 0} package${packages?.length === 1 ? "" : "s"}`,
    }),
  },
});
