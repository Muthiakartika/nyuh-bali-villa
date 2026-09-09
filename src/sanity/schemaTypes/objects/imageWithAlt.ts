import { defineField, defineType } from "sanity";

/**
 * An image that is either uploaded to Sanity or hotlinked from the live site.
 *
 * The site does not re-host photographs — `next.config.ts` and CLAUDE.md are
 * explicit that every `<Image>` points at nyuhbalivillas.com's own CDN. So
 * `externalUrl` carries that link, and the content migration fills it in
 * rather than downloading and uploading ~200 files into a project that does
 * not exist yet.
 *
 * Uploading stays available and always wins: the moment an editor drops a
 * file onto the image field, the asset takes over from the hotlink for that
 * one image, with no migration and no code change. That is what makes this a
 * staging post rather than a permanent fork — images can move into Sanity one
 * at a time, whenever the client wants them to.
 */
export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      description:
        "Describe the image for people using screen readers. Leave decorative images out instead of using an empty description.",
      validation: (Rule) => Rule.required().min(3).max(180),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
    defineField({
      name: "externalUrl",
      title: "Hotlinked image URL",
      type: "url",
      description:
        "Used when nothing is uploaded above. Upload a file to replace it — the upload always wins.",
      validation: (Rule) =>
        Rule.uri({ scheme: ["http", "https"] }).custom((value, context) => {
          // An image with neither an upload nor a link renders nothing, which
          // is a silent hole in the page rather than a visible mistake.
          const parent = context.parent as { asset?: unknown } | undefined;
          if (!value && !parent?.asset) return "Upload an image or paste an image URL.";
          return true;
        }),
    }),
  ],
  preview: {
    select: { title: "alt", subtitle: "caption", media: "asset" },
  },
});
