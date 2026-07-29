import type { PostBlock } from "@/data/posts";

/** A run of body text, or an inline link the source encoded as `[link:…]`. */
export type InlineSegment =
  | { kind: "text"; text: string }
  | { kind: "link"; href: string; text: string; external: boolean };

const LINK = /\[link:([^\]]+)\]([^\s.,;:!?)]*)/g;
const LIVE_ORIGIN = "https://nyuhbalivillas.com";

/**
 * Turns the source's `[link:https://…/ubud/]ubud` shorthand into real links.
 *
 * Two posts carry one of these each, and until now they rendered as visible
 * text — a 68-character unbreakable token sitting in the middle of a
 * paragraph. That was not only wrong to read, it forced 228px of horizontal
 * page scroll at 390px, because no word-break opportunity exists inside it.
 *
 * Both point at the live site's own pages, which this build publishes at the
 * identical paths, so they are rewritten as internal links rather than sending
 * a reader off-site. Anything pointing elsewhere stays absolute and is marked
 * external for the caller to open in a new tab.
 */
export function parseInline(text: string): InlineSegment[] {
  const segments: InlineSegment[] = [];
  let cursor = 0;

  for (const match of text.matchAll(LINK)) {
    const [whole, rawHref, label] = match;
    const at = match.index ?? 0;

    if (at > cursor) segments.push({ kind: "text", text: text.slice(cursor, at) });

    const internal = rawHref.startsWith(LIVE_ORIGIN);
    const href = internal
      ? rawHref.slice(LIVE_ORIGIN.length).replace(/\/+$/, "") || "/"
      : rawHref;

    // A marker with no trailing word has nothing to label; keep the URL
    // visible rather than emitting an empty, unclickable anchor.
    segments.push({
      kind: "link",
      href,
      text: label || href,
      external: !internal,
    });

    cursor = at + whole.length;
  }

  if (cursor < text.length) segments.push({ kind: "text", text: text.slice(cursor) });
  return segments;
}

/**
 * One entry in a restored point list: the label the source wrote as a marker
 * line, plus whatever it introduced (its explanatory paragraphs, and on the
 * life-coach post an illustration).
 */
export type PointItem = {
  /** The source's own numeral for an ordered run; `null` for a dashed one. */
  marker: string | null;
  label: string;
  body: PostBlock[];
};

/**
 * What an article is made of, after normalisation.
 *
 * **This union is the contract for the coming CRUD.** An editor should emit
 * these shapes directly; the recovery passes further down this file exist only
 * because the current 17 posts were imported from WordPress with their
 * structure flattened into paragraphs, and they are what a migration would run
 * once. Anything already carrying real blocks passes through untouched.
 *
 *   heading    — a section title (renders `<h2>`)
 *   paragraph  — body copy; may contain `[link:URL]label` shorthand
 *   list       — a plain bulleted list of one-liners
 *   image      — a full-width photograph, flush with the text measure
 *   points     — a titled list: each item is a label plus its own body blocks
 *   price      — a rate table: named columns, one of which holds money
 *   faq        — a heading plus question/answer pairs, rendered as accordions
 */
export type ArticleBlock =
  | PostBlock
  | { kind: "points"; ordered: boolean; items: PointItem[] }
  | { kind: "price"; columns: string[]; rows: string[][] }
  | { kind: "faq"; heading: string; items: { question: string; answer: string }[] };

// The source writes its list markers as literal punctuation at the head of an
// ordinary paragraph — "- Balinese Purification Ceremony at Tirta Empul",
// "1. Traditional Experiences".
const DASH = /^\s*[-–—•]\s+/;
const NUMBER = /^\s*(\d{1,2})[.)]\s+/;

type Marker = { ordered: boolean; marker: string | null; label: string };

function readMarker(block: ArticleBlock): Marker | null {
  if (block.kind !== "paragraph") return null;

  const numbered = NUMBER.exec(block.text);
  if (numbered) {
    return {
      ordered: true,
      marker: numbered[1],
      label: block.text.slice(numbered[0].length).trim(),
    };
  }

  if (DASH.test(block.text)) {
    return {
      ordered: false,
      marker: null,
      label: block.text.replace(DASH, "").trim(),
    };
  }

  return null;
}

/**
 * Restores the list structure the WordPress → blocks conversion dropped.
 *
 * **This is a repair, not a rewrite.** Three posts write their points as
 * marker punctuation at the start of a plain paragraph — five in "Five
 * Relaxing Activities", eight in "10 Romantic Honeymoon Activities", four
 * numbered ones in the life-coach piece. The converter only recognised real
 * `<ul>` markup, so all seventeen came through as ordinary body paragraphs:
 * the articles that are *literally listicles* rendered as the flattest wall of
 * text on the site, with their "- " and "1. " sitting inline like typos.
 *
 * Every word is the source's own. The only thing removed is the marker
 * punctuation itself, which is replaced by a real marker — a gold rule for a
 * dashed run, the source's own numeral for a numbered one. A run ends at a
 * heading, a genuine list, or the first paragraph that carries no marker after
 * the item's body, so prose that merely happens to follow a point is not
 * swallowed into it.
 *
 * Anything without markers passes straight through untouched, which is most
 * posts — this deliberately does not try to guess structure that isn't stated.
 */
function toPointBlocks(blocks: ArticleBlock[]): ArticleBlock[] {
  const out: ArticleBlock[] = [];
  let index = 0;

  while (index < blocks.length) {
    const marker = readMarker(blocks[index]);

    if (!marker) {
      out.push(blocks[index]);
      index += 1;
      continue;
    }

    // A run holds every consecutive item that agrees on its marker style, so a
    // dashed list and a numbered list can't merge into one group.
    const ordered = marker.ordered;
    const items: PointItem[] = [];

    while (index < blocks.length) {
      const next = readMarker(blocks[index]);
      if (!next || next.ordered !== ordered) break;

      const body: PostBlock[] = [];
      index += 1;

      // Everything up to the next marker belongs to this item. Anything
      // structural — a heading, a real list, or a block an earlier pass has
      // already claimed — closes the run entirely.
      while (index < blocks.length) {
        const block = blocks[index];
        if (block.kind !== "paragraph" && block.kind !== "image") break;
        if (readMarker(block)) break;
        body.push(block);
        index += 1;
      }

      items.push({ marker: next.marker, label: next.label, body });
    }

    // A lone marker is a stray dash, not a list. Put it back as a paragraph
    // rather than rendering a one-item list around it.
    if (items.length < 2) {
      const only = items[0];
      out.push({ kind: "paragraph", text: only.label });
      out.push(...only.body);
      continue;
    }

    out.push({ kind: "points", ordered, items });
  }

  return out;
}

// ---------------------------------------------------------------------------
// FAQ recovery
// ---------------------------------------------------------------------------

const ENDS_IN_QUESTION = /\?\s*$/;
// The heading these runs are published under is inconsistent across the blog —
// "FAQ", "Hatha Yoga FAQ", "Find Your Answer", "Learn More". It is absorbed
// into the block so the section isn't titled twice.
const FAQ_HEADING = /^(faq|faqs|frequently asked questions?|find your answers?|learn more|q\s*&\s*a)$/i;
const MIN_FAQ_PAIRS = 3;

/**
 * Recovers the FAQ section that nine of the seventeen posts end with.
 *
 * They are published as alternating paragraphs — a question, then its answer,
 * then the next question — under a heading. Nothing in the imported markup
 * distinguishes them from body copy, so **88 question/answer pairs across nine
 * posts** rendered as an undifferentiated run of short paragraphs, which is
 * both the least readable and the least useful form the content could take.
 *
 * The signal is deliberately conservative: a paragraph ending in "?" followed
 * by one that doesn't, repeated at least three times. Two pairs is not enough
 * to be sure it isn't prose that happens to ask a rhetorical question, and
 * headings that end in "?" are left alone — several posts legitimately use one
 * as a section title.
 */
function toFaqBlocks(blocks: ArticleBlock[]): ArticleBlock[] {
  const out: ArticleBlock[] = [];
  let index = 0;

  while (index < blocks.length) {
    const block = blocks[index];
    const next = blocks[index + 1];

    const startsRun =
      block?.kind === "paragraph" &&
      ENDS_IN_QUESTION.test(block.text) &&
      next?.kind === "paragraph" &&
      !ENDS_IN_QUESTION.test(next.text);

    if (!startsRun) {
      out.push(block);
      index += 1;
      continue;
    }

    const items: { question: string; answer: string }[] = [];
    let cursor = index;
    while (cursor < blocks.length - 1) {
      const question = blocks[cursor];
      const answer = blocks[cursor + 1];
      if (
        question.kind !== "paragraph" ||
        !ENDS_IN_QUESTION.test(question.text) ||
        answer.kind !== "paragraph" ||
        ENDS_IN_QUESTION.test(answer.text)
      ) {
        break;
      }
      items.push({ question: question.text.trim(), answer: answer.text.trim() });
      cursor += 2;
    }

    if (items.length < MIN_FAQ_PAIRS) {
      out.push(block);
      index += 1;
      continue;
    }

    // Absorb the heading immediately above, but only when it reads as a FAQ
    // label. A run sitting under a content heading keeps that heading in place.
    let heading = "FAQ";
    const previous = out[out.length - 1];
    if (previous?.kind === "heading" && FAQ_HEADING.test(previous.text.trim())) {
      heading = previous.text.trim();
      out.pop();
    } else if (previous?.kind === "heading" && /faq/i.test(previous.text)) {
      heading = previous.text.trim();
      out.pop();
    }

    out.push({ kind: "faq", heading, items });
    index = cursor;
  }

  return out;
}

// ---------------------------------------------------------------------------
// Price-table recovery
// ---------------------------------------------------------------------------

const MONEY = /^(IDR|Rp\.?|USD|US\$|\$)\s?[\d.,]+|^[\d.,]+\s*(IDR|USD|k)$/i;
const MAX_CELL = 60;
const MAX_COLUMNS = 6;

const isCell = (block: ArticleBlock) =>
  block.kind === "paragraph" &&
  block.text.trim().length <= MAX_CELL &&
  !ENDS_IN_QUESTION.test(block.text);

/**
 * Recovers a rate table that was serialised column by column.
 *
 * The spa post publishes a three-column table — Service / Duration / Cost —
 * and the import flattened it into fifteen consecutive paragraphs: the word
 * "Service", then four treatment names, then "Duration", then four durations,
 * then "Cost (IDR)", then four prices. Read top to bottom it is nonsense; the
 * prices are five paragraphs away from what they cost.
 *
 * A run of short paragraphs is a table if it divides evenly into `c` columns of
 * one header plus `k` values, where **exactly one column is entirely money and
 * no header is**. That pair of conditions is what makes the partition
 * unambiguous — fifteen cells also divide into five columns of two, but that
 * split puts prices in the header row, so it is rejected. Verified against
 * every post: one table found, no false positives.
 */
function toPriceBlocks(blocks: ArticleBlock[]): ArticleBlock[] {
  const out: ArticleBlock[] = [];
  let index = 0;

  while (index < blocks.length) {
    if (!isCell(blocks[index])) {
      out.push(blocks[index]);
      index += 1;
      continue;
    }

    let end = index;
    const cells: string[] = [];
    while (end < blocks.length && isCell(blocks[end])) {
      const cell = blocks[end];
      if (cell.kind === "paragraph") cells.push(cell.text.trim());
      end += 1;
    }

    let table: { columns: string[]; rows: string[][] } | null = null;

    for (let columns = 2; columns <= MAX_COLUMNS && !table; columns += 1) {
      if (cells.length % columns) continue;
      const perColumn = cells.length / columns - 1;
      if (perColumn < 2) continue;

      const grouped = Array.from({ length: columns }, (_, column) => ({
        head: cells[column * (perColumn + 1)],
        values: cells.slice(
          column * (perColumn + 1) + 1,
          column * (perColumn + 1) + 1 + perColumn,
        ),
      }));

      if (grouped.some((column) => MONEY.test(column.head))) continue;
      if (grouped.filter((c) => c.values.every((v) => MONEY.test(v))).length !== 1) {
        continue;
      }

      table = {
        columns: grouped.map((column) => column.head),
        rows: Array.from({ length: perColumn }, (_, row) =>
          grouped.map((column) => column.values[row]),
        ),
      };
    }

    if (table) {
      out.push({ kind: "price", ...table });
      index = end;
      continue;
    }

    out.push(blocks[index]);
    index += 1;
  }

  return out;
}

// ---------------------------------------------------------------------------

/**
 * The one entry point: raw post blocks in, renderable article blocks out.
 *
 * **Order matters.** FAQ runs first because it is the most specific signal and
 * it consumes the tail of a post whole; the price pass would otherwise see a
 * FAQ's short paragraphs as candidate table cells. Points run last because a
 * marker paragraph is the weakest signal of the three, so anything a stronger
 * pass has already claimed is off the table by the time it looks.
 *
 * All three are idempotent and lossless — a block they don't recognise is
 * passed through unchanged, which is what lets content authored directly as
 * `faq` / `price` / `points` by a future CRUD travel through here untouched.
 */
export function toArticleBlocks(blocks: PostBlock[]): ArticleBlock[] {
  return toPointBlocks(toPriceBlocks(toFaqBlocks(blocks)));
}
