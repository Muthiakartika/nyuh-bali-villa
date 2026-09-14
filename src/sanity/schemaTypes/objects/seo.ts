import { defineField, defineType } from "sanity";

/**
 * Per-route search and social metadata.
 *
 * Every field is optional and every one falls back to `src/data/seo.ts`,
 * which holds each route's published title and description copied from the
 * live site. An empty SEO block therefore emits exactly what the route emits
 * today — see `applySeo` in lib/metadata.ts.
 *
 * The Open Graph pair is separate from the search pair because they are
 * written for different readers: a search title competes in a result list, a
 * social title sits under a photograph. The live site sends the same string
 * for both, so both fall back to the search title rather than to nothing.
 */
export const seo = defineType({
  name: "seo",
  title: "Search and social",
  type: "object",
  options: { collapsible: true, collapsed: true },
  groups: [
    { name: "search", title: "Search", default: true },
    { name: "social", title: "Social sharing" },
    { name: "advanced", title: "Advanced" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Search title",
      type: "string",
      group: "search",
      description:
        "Shown as the blue headline in Google. Aim for 45–60 characters. Leave empty to keep the title this page already publishes.",
      validation: (Rule) => Rule.max(70).warning("Long titles may be truncated in search."),
    }),
    defineField({
      name: "description",
      title: "Meta description",
      type: "text",
      rows: 3,
      group: "search",
      description:
        "The grey summary under the headline. Aim for 120–160 characters.",
      validation: (Rule) =>
        Rule.max(170).warning("Long descriptions may be truncated in search."),
    }),
    defineField({
      name: "ogTitle",
      title: "Social title",
      type: "string",
      group: "social",
      description:
        "Used when the page is shared on Facebook, WhatsApp or LinkedIn. Empty uses the search title above.",
      validation: (Rule) => Rule.max(90).warning("Long social titles get cut off in the card."),
    }),
    defineField({
      name: "ogDescription",
      title: "Social description",
      type: "text",
      rows: 2,
      group: "social",
      description: "Empty uses the meta description above.",
      validation: (Rule) => Rule.max(200).warning("Long social descriptions get cut off."),
    }),
    defineField({
      name: "image",
      title: "Social sharing image",
      type: "imageWithAlt",
      group: "social",
      description:
        "The picture shown when the page is shared. Landscape, at least 1200 × 630. Nothing here means the share shows no picture, which is what the site does today.",
    }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL",
      type: "url",
      group: "advanced",
      description:
        "Only fill this in when this page duplicates another one and should hand its search ranking over. Leave empty otherwise — the page's own address is used.",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      initialValue: false,
      group: "advanced",
      description: "Use only for temporary or intentionally private public pages.",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "description" },
    prepare: ({ title, subtitle }) => ({
      title: title || "Search and social",
      subtitle: subtitle || "Using this page's existing title and description",
    }),
  },
});
