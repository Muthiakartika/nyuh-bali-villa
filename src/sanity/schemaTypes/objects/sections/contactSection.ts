import { defineField, defineType } from "sanity";
import { eyebrowField, pageHeadingLevelField, sectionSettingsFields } from "./shared";

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
        "Ubud's page opens the form column with one line; Seminyak's has none. Empty renders the form on its own. " + "Paragraphs, with bold, italic, links, lists and subheadings. Each paragraph is set in this band's own type — the formatting is inline, the layout stays the band's.",
    }),
    defineField({
      name: "image",
      title: "Photograph",
      type: "imageWithAlt",
      validation: (Rule) => Rule.required(),
    }),
    pageHeadingLevelField("h1"),
    ...sectionSettingsFields,
  ],
  preview: {
    select: { title: "heading", subtitle: "intro", media: "image" },
  },
});
