import { defineField, defineType } from "sanity";

/**
 * An image that is either uploaded to Sanity or addressed by a path this site
 * serves.
 *
 * **The field's name is older than what it holds.** It was written when every
 * `<Image>` pointed at nyuhbalivillas.com's own CDN and the migration filled
 * it with absolute URLs rather than downloading ~200 files. Both halves of
 * that have since changed: the photographs live in `public/uploads/` and in
 * Sanity, and `localizeUploads` rewrites any surviving absolute URL to its
 * `/uploads/…` path on read. So a value here is now normally a site-relative
 * path, and the ones that are still absolute are simply the ones the
 * migration wrote first.
 *
 * Uploading stays available and always wins: the moment an editor drops a
 * file onto the image field, the asset takes over for that one image, with no
 * migration and no code change.
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
      description:
        "Printed under the picture, in the gold small-caps treatment. Most images need none — leave it empty unless the caption says something the picture does not.",
      validation: (Rule) => Rule.max(140),
    }),
    defineField({
      name: "externalUrl",
      title: "Hotlinked image URL",
      type: "url",
      description:
        "Used when nothing is uploaded above — normally a path this site serves, like /uploads/2023/05/photo.webp. Upload a file to replace it; the upload always wins.",
      // `allowRelative` is the whole point: the rule was written for absolute
      // URLs, and then the assets were brought in-house and every value
      // became `/uploads/…`. A relative path fails `Rule.uri` without it, so
      // 24 image fields across 9 documents — every one seeded after the move
      // — showed a red error in the Studio on content that renders correctly.
      // Same trap as the kebab-case field name and the 320-character excerpt:
      // check a rule against `src/data` before adding it, because these
      // documents were seeded from there.
      validation: (Rule) =>
        Rule.uri({ scheme: ["http", "https"], allowRelative: true }).custom((value, context) => {
          // An image with neither an upload nor a link renders nothing, which
          // is a silent hole in the page rather than a visible mistake.
          const parent = context.parent as { asset?: unknown } | undefined;
          if (!value && !parent?.asset) return "Upload an image or paste an image URL.";
          return true;
        }),
    }),
  ],
  preview: {
    select: { title: "alt", caption: "caption", externalUrl: "externalUrl", media: "asset" },
    prepare: ({ title, caption, externalUrl, media }) => ({
      title: title || "No description yet",
      // Says which of the two sources is actually rendering. An uploaded
      // asset always wins (see resolveImageUrl), and knowing which you are
      // looking at is the difference between "my new photo isn't showing" and
      // "I dropped it on the wrong field".
      subtitle: caption || (media ? "Uploaded" : externalUrl ? "From /uploads" : "No image"),
      media,
    }),
  },
});
