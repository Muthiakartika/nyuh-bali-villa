import { defineArrayMember, defineField, defineType } from "sanity";
import { eyebrowField, sectionSettingsFields } from "./shared";

/**
 * The About band — the one that carries "Best Price Guaranteed".
 *
 * It exists as its own section rather than being approximated with
 * `splitContentSection` because the two are different layouts: split content
 * is text beside a photograph, while this is an explicit three-part grid
 * (heading top-left, dark offer plate bottom-left, narrative spanning the
 * right). Rendering it through `AboutNarrative` is what keeps a CMS-authored
 * About page byte-identical to the hand-written one — the same rule every
 * other section here follows.
 *
 * Two values are deliberately *not* fields: the booking link and the contact
 * email. Both are per-property and already live on the property document, so
 * duplicating them here would let a page drift from the header, the footer and
 * every other CTA on the site.
 */
export const aboutNarrativeSection = defineType({
  name: "aboutNarrativeSection",
  title: "About + Best Price Guaranteed",
  type: "object",
  groups: [
    { name: "narrative", title: "Narrative", default: true },
    { name: "offer", title: "Best Price Guaranteed" },
  ],
  fields: [
    { ...eyebrowField, group: "narrative" },
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      group: "narrative",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "paragraphs",
      title: "Narrative",
      type: "array",
      group: "narrative",
      of: [defineArrayMember({ type: "text", rows: 6 })],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "tagline",
      title: "Closing line",
      type: "string",
      group: "narrative",
      description:
        'Set in the handwriting face under the narrative — Seminyak\'s "We serve with smile and sincerity". Leave empty to omit it, as Ubud does.',
    }),
    defineField({
      name: "buttonLabel",
      title: "Button label",
      type: "string",
      group: "narrative",
      description:
        'Seminyak reads "Book Your Stay", Ubud "Plan Now". The link itself is the property\'s own booking URL.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "promoCode",
      title: "Promo code",
      type: "string",
      group: "offer",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "perks",
      title: "Privileges",
      type: "array",
      group: "offer",
      of: [defineArrayMember({ type: "string" })],
      description: "One line each, listed under the promo code.",
    }),
    defineField({
      name: "image",
      title: "Photograph in the offer plate",
      type: "imageWithAlt",
      group: "offer",
      description: "Optional. Sits above “Best Price Guaranteed”.",
    }),
    ...sectionSettingsFields,
  ],
  preview: {
    select: { title: "heading", subtitle: "promoCode", media: "image" },
    prepare: ({ title, subtitle, media }) => ({
      title: title || "About",
      subtitle: subtitle ? `Promo code “${subtitle}”` : undefined,
      media,
    }),
  },
});
