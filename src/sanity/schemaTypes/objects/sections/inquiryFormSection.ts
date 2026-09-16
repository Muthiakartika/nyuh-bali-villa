import { defineArrayMember, defineField, defineType } from "sanity";
import { pageHeadingLevelField, sectionSettingsFields, toneField } from "./shared";

/** Mirrors the `InquiryField` union in InquiryForm.tsx. */
const fieldKinds = [
  { title: "Single line", value: "text" },
  { title: "Email", value: "email" },
  { title: "Telephone", value: "tel" },
  { title: "Number", value: "number" },
  { title: "Date", value: "date" },
  { title: "Paragraph", value: "textarea" },
  { title: "Single choice", value: "radio" },
  { title: "Multiple choice", value: "checkbox" },
];

export const inquiryFormSection = defineType({
  name: "inquiryFormSection",
  title: "Enquiry form",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "fields",
      title: "Fields",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "inquiryField",
          title: "Field",
          fields: [
            defineField({
              name: "kind",
              title: "Type",
              type: "string",
              options: { list: fieldKinds },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "name",
              title: "Field name",
              type: "string",
              description:
                "The identifier this answer is submitted and emailed under — not shown to the visitor. Letters, digits, hyphens and underscores; no spaces. Leave an existing one alone: changing it renames the line in the notification email.",
              // **Not kebab-case.** It was, and the project's own data broke it:
              // the Wedding page ships six camelCase names (`weddingDate`,
              // `hairMakeup`, …), so every editor opening that page met six red
              // errors on content that has always worked. A form identifier
              // only has to survive form encoding and read sensibly in the
              // email — the case convention is house style, and house style
              // does not belong in a rule that blocks saving.
              validation: (Rule) =>
                Rule.required().regex(/^[A-Za-z][A-Za-z0-9_-]*$/, {
                  name: "field name",
                }),
            }),
            defineField({
              name: "options",
              title: "Choices",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              hidden: ({ parent }) =>
                parent?.kind !== "radio" && parent?.kind !== "checkbox",
              validation: (Rule) =>
                Rule.custom((value, context) => {
                  const kind = (context.parent as { kind?: string } | undefined)?.kind;
                  if (kind !== "radio" && kind !== "checkbox") return true;
                  return value?.length ? true : "A choice field needs at least one option.";
                }),
            }),
            defineField({
              name: "required",
              title: "Required",
              type: "boolean",
              initialValue: false,
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "kind" },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "pricing",
      title: "Price summary",
      type: "object",
      description:
        "The running total the two spa forms show — Price, Tax and Service, Discount, Total. Leave it off for every other form.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "enabled",
          title: "Show the price summary",
          type: "boolean",
          initialValue: false,
        }),
        defineField({
          name: "field",
          title: "Which question is priced",
          type: "string",
          description:
            'The field name of the treatment checkboxes — "package" on both spa forms. Each choice is priced from the IDR figure in its own label.',
          initialValue: "package",
        }),
        defineField({
          name: "taxPercent",
          title: "Tax and service (%)",
          type: "number",
          initialValue: 21,
          validation: (Rule) => Rule.min(0).max(100),
        }),
        defineField({
          name: "discountPercent",
          title: "Discount (%)",
          type: "number",
          description:
            "Taken off the total *after* tax, which is how the live forms calculate it. Seminyak gives 20%, Ubud 15%.",
          initialValue: 0,
          validation: (Rule) => Rule.min(0).max(100),
        }),
        defineField({
          name: "note",
          title: "Condition under the discount",
          type: "string",
          description:
            'Shown with an asterisk. Ubud reads "Discount is valid for booking minimum one week in advance"; Seminyak shows none.',
        }),
      ],
    }),
    defineField({ name: "submitLabel", title: "Submit button label", type: "string" }),
    defineField({
      name: "confirmation",
      title: "Confirmation message",
      type: "text",
      rows: 2,
      description: "Shown in place of the form once it has been sent.",
    }),
    pageHeadingLevelField("h2"),
    toneField,
    ...sectionSettingsFields,
  ],
  preview: {
    select: { title: "heading", fields: "fields" },
    prepare: ({ title, fields }) => ({
      title: title || "Enquiry form",
      subtitle: `${fields?.length ?? 0} field${fields?.length === 1 ? "" : "s"}`,
    }),
  },
});
