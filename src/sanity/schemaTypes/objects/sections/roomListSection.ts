import { defineArrayMember, defineField, defineType } from "sanity";
import { eyebrowField, sectionSettingsFields, toneField } from "./shared";

/**
 * An accommodation listing written on the page.
 *
 * **Why this is not `collectionSection` with `collection: "room"`.** That one
 * lists the room *documents*, which is right for a page that wants "every room
 * we have". The Stay pages don't: each row there carries its own three-photo
 * selection, and it is deliberately not the detail page's — the Ubud Suite row
 * shows Suite-6/4/2 while the room document's gallery opens on Suite-1/2/3.
 * Listing the documents would quietly repaint both Stay pages. The photographs
 * and the two intro paragraphs are page content, so they live on the page.
 *
 * "Check Rates" is not a field: it is the property's own booking URL, the same
 * link the header CTA uses.
 */
export const roomListSection = defineType({
  name: "roomListSection",
  title: "Room list (written here)",
  type: "object",
  fields: [
    eyebrowField,
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 6 }),
    defineField({
      name: "rooms",
      title: "Rooms",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "roomListItem",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "images",
              title: "Photographs",
              type: "array",
              of: [defineArrayMember({ type: "imageWithAlt" })],
            }),
            defineField({ name: "bed", title: "Bedding", type: "string" }),
            defineField({ name: "size", title: "Size", type: "string" }),
            defineField({ name: "occupancy", title: "Occupancy", type: "string" }),
            defineField({
              name: "detailsHref",
              title: "Details page",
              type: "string",
              description: "Path to this room's own page, e.g. /ubud/villa/suite.",
            }),
            defineField({
              name: "detailsInScope",
              title: "That page exists",
              type: "boolean",
              initialValue: true,
              description: "Turn off to show the button without linking anywhere.",
            }),
          ],
          preview: { select: { title: "name", subtitle: "size", media: "images.0" } },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    toneField,
    ...sectionSettingsFields,
  ],
  preview: {
    select: { title: "heading", rooms: "rooms" },
    prepare: ({ title, rooms }) => ({
      title: title || "Rooms",
      subtitle: `${(rooms as unknown[] | undefined)?.length ?? 0} rooms`,
    }),
  },
});
