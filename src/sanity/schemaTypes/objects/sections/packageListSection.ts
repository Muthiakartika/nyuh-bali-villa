import { defineArrayMember, defineField, defineType } from "sanity";
import {
  eyebrowField,
  pageHeadingLevelField,
  sectionSettingsFields,
  toneField,
} from "./shared";

export const packageListSection = defineType({
  name: "packageListSection",
  title: "Packages",
  type: "object",
  fields: [
    eyebrowField,
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "inlineRichText",
      description: "One paragraph under the heading. Bold, italic and links are available.",
    }),
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
    // H1 is offered here, unlike most bands, because on the four in-room /
    // staff pages this band *is* the page — they have no hero, so its heading
    // is the page title and the seed writes "h1". The narrower field rejected
    // that value, so those four documents showed a red error on content that
    // renders correctly.
    pageHeadingLevelField("h2"),
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
