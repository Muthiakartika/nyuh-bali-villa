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
