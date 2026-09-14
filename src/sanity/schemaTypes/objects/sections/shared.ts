import type { FieldDefinition } from "sanity";
import { defineField } from "sanity";

export const sectionSettingsFields: FieldDefinition[] = [
  defineField({
    name: "anchor",
    title: "Section anchor",
    type: "string",
    description: "Optional ID for links such as /ubud/spa#treatments. Letters, numbers, and hyphens only.",
    validation: (Rule) =>
      Rule.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { invert: false }).warning(
        "Use lowercase words separated by hyphens.",
      ),
  }),
  defineField({
    name: "isHidden",
    title: "Hide this section",
    type: "boolean",
    initialValue: false,
    description: "Keeps the content in the document without rendering it on the website.",
  }),
];

/**
 * The two band backgrounds the site alternates between. Named after the
 * existing `tone` prop that Section, LinkCardGrid, ProgramList and
 * TreatmentList already accept, so a value chosen here is passed straight
 * through rather than translated.
 */
export const toneField = defineField({
  name: "tone",
  title: "Background",
  type: "string",
  options: {
    layout: "radio",
    list: [
      { title: "Sand", value: "sand" },
      { title: "Deep sand", value: "sand-deep" },
    ],
  },
  initialValue: "sand",
});

export const eyebrowField = defineField({
  name: "eyebrow",
  title: "Eyebrow",
  type: "string",
  description: "Small letter-spaced label above the heading.",
});

/**
 * How a section's heading is marked up — **not** how large it looks.
 *
 * The size is the design's, and stays the design's: `SectionHeading` sets
 * every band heading in the same `text-section` scale whichever tag it uses,
 * so choosing H3 changes the document outline a screen reader and a search
 * engine read, and changes nothing a sighted visitor sees. That is the point
 * — a subsection that looks like a band but sits *under* the band above it
 * should say so.
 *
 * **H1 is not offered.** A page's `<h1>` is its hero or its opening section,
 * every page has exactly one, and the whole-site audit checks that. Letting a
 * band claim one is the single easiest way for an editor to break page
 * structure without seeing anything change, so the ladder starts at H2.
 * `page.sections` validates the other half of the same rule — that a page
 * carries exactly one section capable of producing an `<h1>`.
 */
export const headingLevelField = defineField({
  name: "headingLevel",
  title: "Heading level",
  type: "string",
  options: {
    layout: "radio",
    list: [
      { title: "H2 — a section of the page", value: "h2" },
      { title: "H3 — part of the section above", value: "h3" },
      { title: "H4 — part of the H3 above", value: "h4" },
    ],
  },
  initialValue: "h2",
  description:
    "Affects the page outline for search engines and screen readers, not the size on screen. Leave on H2 unless this band belongs under the one before it.",
});

/**
 * The same control for the two sections that can legitimately carry a page's
 * `<h1>`: the contact body (whose heading *is* the contact page's title) and
 * the enquiry form (which is the only heading on each of the three standalone
 * form pages).
 *
 * H1 is offered here and nowhere else, and `page.sections` validates that a
 * document ends up with exactly one section producing one — so the invariant
 * is enforced at the level it actually holds at, the page, rather than by
 * hoping no two sections claim it.
 */
export function pageHeadingLevelField(initial: "h1" | "h2") {
  return defineField({
    name: "headingLevel",
    title: "Heading level",
    type: "string",
    options: {
      layout: "radio",
      list: [
        { title: "H1 — this is the page's title", value: "h1" },
        { title: "H2 — a section of the page", value: "h2" },
        { title: "H3 — part of the section above", value: "h3" },
      ],
    },
    initialValue: initial,
    description:
      "Affects the page outline for search engines and screen readers, not the size on screen. Use H1 only when this is the page's own title — a page with a hero already has one.",
  });
}
