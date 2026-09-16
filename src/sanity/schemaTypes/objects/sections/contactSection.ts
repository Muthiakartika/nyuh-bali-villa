import { defineField, defineType } from "sanity";
import { eyebrowField, pageHeadingLevelField, sectionSettingsFields, toneField } from "./shared";

/**
 * The contact page's body — heading, photograph, and the enquiry form.
 *
 * The form's own fields are not content: `ContactForm` carries the same five
 * every property uses, and a page that could reshape them would be a second
 * form to keep working. The data-driven `inquiryFormSection` is the section
 * for a form whose fields *are* the point (the wedding and tour enquiries).
 */
export const contactSection = defineType({
  name: "contactSection",
  title: "Contact form + photograph",
  type: "object",
  fields: [
    eyebrowField,
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Contact Us",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Line above the form",
      type: "proseRichText",
      description:
        "Ubud's page opens the form column with one line; Seminyak's has none. Empty renders the form on its own. " + "Select any words to make them bold, italic or a link. Press Return for a new paragraph; the style menu adds subheadings, quotes and lists. The layout stays the band's — formatting is inline only.",
    }),
    defineField({
      name: "formHeading",
      title: "Heading above the form fields",
      type: "string",
      description:
        'Sits inside the form itself, under the band heading. Empty reads "Please fill in the form below".',
    }),
    defineField({
      name: "confirmation",
      title: "Message after sending",
      type: "text",
      rows: 2,
      description:
        "Replaces the form once the enquiry has actually been emailed — it is never shown if delivery failed.",
    }),
    defineField({
      name: "image",
      title: "Photograph",
      type: "imageWithAlt",
      validation: (Rule) => Rule.required(),
    }),
    pageHeadingLevelField("h1"),
    toneField,
    ...sectionSettingsFields,
  ],
  preview: {
    select: { title: "heading", subtitle: "intro", media: "image" },
  },
});
