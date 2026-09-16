import { defineField, defineType } from "sanity";
import { eyebrowField, headingLevelField, sectionSettingsFields, toneField } from "./shared";

/**
 * A heading with plain paragraphs under it — the Explore Bali page's "You are
 * in the Right Hands . . .".
 *
 * **Not `richTextSection`.** That one renders portable text at the `read`
 * width (760px, the blog's measure); this runs the page's normal `wide`
 * container with the paragraphs capped at 62rem. Seeding the tour page with
 * the near-miss would have narrowed a band the client never asked to change,
 * which is why this exists as its own type rendering `ProseBand`.
 */
export const proseSection = defineType({
  name: "proseSection",
  title: "Heading + paragraphs",
  type: "object",
  fields: [
    eyebrowField,
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "paragraphs",
      title: "Paragraphs",
      type: "proseRichText",
      description:
        "Select any words to make them bold, italic or a link. Press Return for a new paragraph; the style menu adds subheadings, quotes and lists. The layout stays the band's — formatting is inline only. Writing {email} anywhere still drops in the property's own reservations address as a link — it is never typed here, so it cannot disagree with the footer.",
      validation: (Rule) => Rule.required().min(1),
    }),
    toneField,
    headingLevelField,
    ...sectionSettingsFields,
  ],
  preview: {
    select: { title: "heading", subtitle: "paragraphs.0" },
  },
});
