import { defineArrayMember, defineField, defineType } from "sanity";
import { eyebrowField, sectionSettingsFields, toneField } from "./shared";

export const gallerySection = defineType({
  name: "gallerySection",
  title: "Gallery",
  type: "object",
  fields: [
    eyebrowField,
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [defineArrayMember({ type: "imageWithAlt" })],
      validation: (Rule) => Rule.required().min(1),
      options: { layout: "grid" },
    }),
    defineField({
      name: "alt",
      title: "Set description",
      type: "string",
      description: "One alt string for the whole set — every slide shows the same subject.",
    }),
    toneField,
    ...sectionSettingsFields,
  ],
  preview: {
    select: { title: "heading", images: "images", media: "images.0" },
    prepare: ({ title, images, media }) => ({
      title: title || "Gallery",
      subtitle: `${images?.length ?? 0} image${images?.length === 1 ? "" : "s"}`,
      media,
    }),
  },
});
