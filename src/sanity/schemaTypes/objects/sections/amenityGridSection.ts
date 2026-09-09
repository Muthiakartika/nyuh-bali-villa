import { defineArrayMember, defineField, defineType } from "sanity";
import { sectionSettingsFields, toneField } from "./shared";

export const amenityGridSection = defineType({
  name: "amenityGridSection",
  title: "Amenities",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({
      name: "amenities",
      title: "Amenities",
      type: "array",
      of: [defineArrayMember({ type: "amenity" })],
      validation: (Rule) => Rule.required().min(1),
    }),
    toneField,
    ...sectionSettingsFields,
  ],
  preview: {
    select: { title: "heading", amenities: "amenities" },
    prepare: ({ title, amenities }) => ({
      title: title || "Amenities",
      subtitle: `${amenities?.length ?? 0} amenit${amenities?.length === 1 ? "y" : "ies"}`,
    }),
  },
});
