import { defineArrayMember, defineField, defineType } from "sanity";
import { eyebrowField, headingLevelField, sectionSettingsFields, toneField } from "./shared";

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
    defineField({
      name: "intro",
      title: "Intro",
      type: "proseRichText",
      description: "Select any words to make them bold, italic or a link. Press Return for a new paragraph; the style menu adds subheadings, quotes and lists. The layout stays the band's — formatting is inline only.",
    }),
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
              description:
                "Shown as a gallery in the listing row. Deliberately a different selection from the room's own page — see the note at the top of this file.",
              options: { layout: "grid" },
              validation: (Rule) => Rule.min(1).warning("A row with no photograph reads as a gap."),
            }),
            defineField({
              name: "bed",
              title: "Bedding",
              type: "string",
              description: 'The line under the name — "1 King Bed".',
            }),
            defineField({
              name: "size",
              title: "Size",
              type: "string",
              description: 'Including the unit — "68 m²".',
            }),
            defineField({
              name: "occupancy",
              title: "Occupancy",
              type: "string",
              description: 'How many the room sleeps — "2 Adults".',
            }),
            defineField({
              name: "detailsHref",
              title: "Details page",
              type: "string",
              description: "Path to this room's own page, e.g. /ubud/villa/suite.",
              validation: (Rule) =>
                Rule.custom((value) => {
                  if (!value) return true;
                  return value.startsWith("/")
                    ? true
                    : "Start the path with a slash — this button always points at a page on this site.";
                }),
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
    headingLevelField,
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
