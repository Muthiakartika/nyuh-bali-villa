import { defineField, defineType } from "sanity";

/**
 * The icon list is a closed enum on purpose: `AmenityGrid` maps each name to
 * a hand-drawn SVG component, so a free-text icon name would render nothing.
 * Keep this list in step with `AmenityIconName` in AmenityGrid.tsx.
 */
export const amenity = defineType({
  name: "amenity",
  title: "Amenity",
  type: "object",
  fields: [
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      options: {
        list: [
          { title: "WiFi", value: "wifi" },
          { title: "Spa", value: "spa" },
          { title: "Dining", value: "dining" },
          { title: "Romance", value: "romance" },
          { title: "Service", value: "service" },
          { title: "Yoga", value: "yoga" },
          { title: "Gym", value: "gym" },
          { title: "Class", value: "class" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Second line",
      type: "string",
      description: 'The row sets each amenity over two lines — "Complimentary" / "WIFI".',
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "subtitle", icon: "icon" },
    prepare: ({ title, subtitle, icon }) => ({
      title,
      subtitle: [icon, subtitle].filter(Boolean).join(" · "),
    }),
  },
});
