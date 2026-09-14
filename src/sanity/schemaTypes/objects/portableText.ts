import { defineArrayMember, defineField, defineType } from "sanity";
import { hrefField, linkReferenceField, linkTypeField } from "./linkTarget";

/**
 * The link annotation shared by both rich-text types.
 *
 * It carries the same internal-reference / typed-URL pair as the `link`
 * object, so an editor learns one way of choosing a destination and uses it
 * everywhere. The text of a link is the text it is applied to — that is what
 * an annotation is — so there is no separate "label" field here.
 */
const textLinkAnnotation = defineField({
  name: "textLink",
  title: "Link",
  type: "object",
  fields: [
    linkTypeField,
    linkReferenceField,
    hrefField({ required: true, title: "Web address" }),
    defineField({
      name: "blank",
      title: "Open in a new tab",
      type: "boolean",
      initialValue: false,
      description: "An address on another website opens in a new tab automatically.",
    }),
  ],
});

const decorators = [
  { title: "Bold", value: "strong" },
  { title: "Italic", value: "em" },
];

/**
 * Full rich text: headings, lists, quotes, images.
 *
 * **H1 is deliberately absent.** Every page on this site takes its `<h1>`
 * from the hero or from its opening section, and exactly one `<h1>` per page
 * is an invariant the whole-site audit checks. A heading style inside body
 * copy is a subheading by definition, so the ladder starts at H2.
 *
 * Rendered by `SanityPortableText`, which has a matching treatment for every
 * style and mark listed here and nothing more — an option added here without
 * one there renders as an unstyled paragraph.
 */
export const portableText = defineType({
  name: "portableText",
  title: "Rich text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Paragraph", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Heading 4", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet list", value: "bullet" },
        { title: "Numbered list", value: "number" },
      ],
      marks: {
        decorators,
        annotations: [textLinkAnnotation],
      },
    }),
    defineArrayMember({ type: "imageWithAlt" }),
  ],
});

/**
 * Rich text for copy that renders **inside a paragraph the layout already
 * draws** — a package pitch, a listing intro.
 *
 * Blocks, lists, headings and images are all absent on purpose: the markup
 * around these is a single `<p>`, so anything block-level would be invalid
 * HTML nested inside it. What is left is what the design actually uses —
 * the bold the in-room directory pages set their instructions in, italics,
 * and links.
 */
export const inlineRichText = defineType({
  name: "inlineRichText",
  title: "Text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [{ title: "Paragraph", value: "normal" }],
      lists: [],
      marks: {
        decorators,
        annotations: [textLinkAnnotation],
      },
    }),
  ],
});

/**
 * Body copy for a page band — the About narrative, a listing intro, the prose
 * under a heading.
 *
 * Sits between the other two. `inlineRichText` is a single paragraph because
 * its value renders inside a `<p>` the layout draws; `portableText` is a whole
 * band of prose with its own type scale and its own images. This is several
 * paragraphs set in the band's own treatment, so it offers lists, links and
 * subheadings and no images — the bands that show a photograph have a field
 * for it already.
 *
 * **H2 is deliberately absent, and H3/H4 are what is left.** These paragraphs
 * sit under the band's own heading, which is an H2 unless an editor has
 * lowered it. A heading written inside the body is therefore a subheading by
 * definition, and offering H2 would let a band's body outrank the band.
 */
export const proseRichText = defineType({
  name: "proseRichText",
  title: "Paragraphs",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Paragraph", value: "normal" },
        { title: "Subheading", value: "h3" },
        { title: "Small subheading", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet list", value: "bullet" },
        { title: "Numbered list", value: "number" },
      ],
      marks: {
        decorators,
        annotations: [textLinkAnnotation],
      },
    }),
  ],
});
