import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Mirrors `Experience` in src/data/experiences.ts, field for field.
 *
 * The shape is deliberately not flattened into a page builder: what a retreat
 * gives you depends on how long you stay, and that is carried by `programs`
 * (tiers) rather than by one undifferentiated inclusions list. The data file
 * makes the same point — flattening the tiers "lost the whole point of the
 * section".
 */
export const experience = defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "programmes", title: "Programmes" },
    { name: "extras", title: "Highlights & team" },
    { name: "media", title: "Media" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: "slug",
      title: "Path under /ubud/",
      type: "string",
      group: "content",
      description: 'For example wellness/yoga or retreat/luxury/new-beginning. No leading slash.',
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value) return true;
          if (value.startsWith("/")) return "Leave off the leading slash.";
          if (value.endsWith("/")) return "Leave off the trailing slash.";
          return /^[a-z0-9]+(?:[-/][a-z0-9]+)*$/.test(value)
            ? true
            : "Use lowercase words separated by hyphens, and / between segments.";
        }),
    }),
    defineField({
      name: "group",
      title: "Group",
      type: "string",
      group: "content",
      options: {
        layout: "radio",
        list: [
          { title: "Retreat", value: "retreat" },
          { title: "Wellness", value: "wellness" },
          { title: "Culture", value: "culture" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "paragraphs",
      title: "Intro paragraphs",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "text", rows: 5 })],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "recommendedFor",
      title: "Recommended for",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "string" })],
      description: "The bullets on the four personalised retreats.",
    }),
    defineField({
      name: "note",
      title: "Closing note",
      type: "text",
      rows: 3,
      group: "content",
      description: 'The "not one-size-fits-all" paragraph, which sits after the Recommended for list.',
    }),
    defineField({
      name: "sections",
      title: "Prose blocks",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "experienceSection" })],
      description: "Titled blocks between the intro and the programmes.",
    }),
    defineField({
      name: "blocks",
      title: "Bullet blocks",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "bulletBlock" })],
      description: 'Stand-alone lists — "The Benefit of…", "What’s Included?".',
    }),
    defineField({
      name: "programsHeading",
      title: "Programmes heading",
      type: "string",
      group: "programmes",
      initialValue: "Available Programs",
    }),
    defineField({
      name: "programs",
      title: "Programme tiers",
      type: "array",
      group: "programmes",
      of: [defineArrayMember({ type: "experienceProgram" })],
      description: "Length-of-stay tiers. Retreat programmes carry these instead of one inclusions list.",
    }),
    defineField({
      name: "inclusions",
      title: "Inclusions",
      type: "array",
      group: "programmes",
      of: [defineArrayMember({ type: "string" })],
      description: "Used by pages that state one flat list. Leave empty when tiers are used.",
    }),
    defineField({
      name: "price",
      title: "Price line",
      type: "string",
      group: "programmes",
      description: "Verbatim, where the page states one.",
    }),
    defineField({
      name: "highlightsHeading",
      title: "Highlights heading",
      type: "string",
      group: "extras",
      initialValue: "Why Choose Ubud Nyuh Bali Resort?",
    }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      group: "extras",
      of: [defineArrayMember({ type: "experienceHighlight" })],
    }),
    defineField({
      name: "closingCta",
      title: "Closing band",
      type: "string",
      group: "extras",
      description: 'The "Begin your … journey in Ubud, Bali" band.',
    }),
    defineField({
      name: "teamHeading",
      title: "Team heading",
      type: "string",
      group: "extras",
      description: '"Meet our Anti Aging’s Team", "Meet our Slimming Team".',
    }),
    defineField({
      name: "team",
      title: "Team",
      type: "array",
      group: "extras",
      of: [defineArrayMember({ type: "teamMember" })],
    }),
    defineField({
      name: "faqHeading",
      title: "FAQ heading",
      type: "string",
      group: "content",
      description: 'The yoga page says "FAQ", the slimming page "Frequently Asked Questions".',
      initialValue: "FAQ",
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "faqItem" })],
    }),
    defineField({
      name: "hero",
      title: "Hero image",
      type: "imageWithAlt",
      group: "media",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      group: "media",
      of: [defineArrayMember({ type: "imageWithAlt" })],
      options: { layout: "grid" },
    }),
    defineField({ name: "seo", title: "Search and social", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { title: "title", subtitle: "slug", group: "group", media: "hero" },
    prepare: ({ title, subtitle, group, media }) => ({
      title,
      subtitle: [group, subtitle].filter(Boolean).join(" · "),
      media,
    }),
  },
  orderings: [
    {
      title: "Group, then title",
      name: "groupTitle",
      by: [
        { field: "group", direction: "asc" },
        { field: "title", direction: "asc" },
      ],
    },
  ],
});
