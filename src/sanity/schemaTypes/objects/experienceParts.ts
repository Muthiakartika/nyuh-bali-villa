import { defineArrayMember, defineField, defineType } from "sanity";

/** A titled prose block between an experience's intro and its programmes. */
export const experienceSection = defineType({
  name: "experienceSection",
  title: "Prose block",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Paragraphs",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 5 })],
      description: "One entry per paragraph.",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "imageWithAlt",
      description: "Optional — only the slimming page's device block carries one.",
    }),
  ],
  preview: {
    select: { title: "heading", body: "body", media: "image" },
    prepare: ({ title, body, media }) => ({
      title,
      subtitle: `${body?.length ?? 0} paragraph${body?.length === 1 ? "" : "s"}`,
      media,
    }),
  },
});

/** One card of the "Why Choose Ubud Nyuh Bali Resort?" grid. */
export const experienceHighlight = defineType({
  name: "experienceHighlight",
  title: "Highlight",
  type: "object",
  fields: [
    defineField({
      name: "icon",
      title: "Icon",
      type: "imageWithAlt",
      description: "The gold line icon shown above the title.",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: { select: { title: "title", subtitle: "body", media: "icon" } },
});

/**
 * One tier of the "Available Programs" accordion — "5 Nights", "7 Nights".
 * Each tier lists its own treatments and then repeats the two shared blocks,
 * exactly as the live page does.
 */
export const experienceProgram = defineType({
  name: "experienceProgram",
  title: "Programme tier",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Tier name",
      type: "string",
      description: '"5 Nights", "7 Nights".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "groups",
      title: "Bullet groups",
      type: "array",
      of: [defineArrayMember({ type: "bulletGroup" })],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "name", groups: "groups" },
    prepare: ({ title, groups }) => ({
      title,
      subtitle: `${groups?.length ?? 0} group${groups?.length === 1 ? "" : "s"}`,
    }),
  },
});

/** One person in the "Meet our … Team" row. */
export const teamMember = defineType({
  name: "teamMember",
  title: "Team member",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "photo", title: "Photo", type: "imageWithAlt" }),
    defineField({
      name: "bio",
      title: "Biography",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: { select: { title: "name", subtitle: "bio", media: "photo" } },
});

/** A stand-alone titled block of bullet groups, with an optional intro. */
export const bulletBlock = defineType({
  name: "bulletBlock",
  title: "Bullet block",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 3 }),
    defineField({
      name: "groups",
      title: "Bullet groups",
      type: "array",
      of: [defineArrayMember({ type: "bulletGroup" })],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: { select: { title: "heading", subtitle: "intro" } },
});
