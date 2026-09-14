import { Fragment } from "react";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

/**
 * Body copy for the page bands, rendered in whatever type treatment the band
 * already uses.
 *
 * ── Why this is not `SanityPortableText` ─────────────────────────────
 *
 * That one owns its own type scale, because `richTextSection` is a band whose
 * whole content is prose. These fields are different: they sit *inside* a band
 * that already sets its paragraph class — 17px/1.7 on the About narrative,
 * 17px/relaxed beside the contact form — and the spacing between paragraphs
 * comes from the wrapper the band draws (`flex flex-col gap-4`), not from a
 * margin on the paragraph. Rendering them through a component with opinions of
 * its own would have changed the look of every band it touched.
 *
 * So the band passes its own classes in, and this renders siblings with no
 * wrapper of its own. **One block produces exactly the markup the band
 * produced when this was a plain string**, which is what let these fields
 * become rich text without a single pixel moving.
 *
 * ── It accepts all three shapes ──────────────────────────────────────
 *
 * Portable text, a plain string, or the `string[]` these fields were before —
 * because a document published before the migration still holds one of the
 * latter two, and `src/data` still holds them as the fallback every route
 * uses when Sanity is unconfigured. Nothing has to be converted for a page to
 * render correctly.
 */
export type ProseValue = string | string[] | PortableTextBlock[] | undefined | null;

function isBlocks(value: ProseValue): value is PortableTextBlock[] {
  return Array.isArray(value) && typeof value[0] === "object";
}

/** Everything renderable, as an array — a string becomes one paragraph. */
function asParagraphs(value: ProseValue): string[] {
  if (!value) return [];
  if (typeof value === "string") return [value];
  return (value as string[]).filter((item) => typeof item === "string" && item);
}

type RichProseProps = {
  value: ProseValue;
  /** The band's own paragraph classes, applied to every paragraph. */
  paragraphClassName: string;
  /** Extra classes on the first block only — the band's opening margin. */
  firstClassName?: string;
  /** Extra classes on every block after the first. */
  restClassName?: string;
  /**
   * When set, the token `{email}` anywhere in the copy becomes a mailto link.
   *
   * Kept for the Explore Bali band, whose published copy uses it: the address
   * comes from the property document, so it cannot disagree with the footer.
   * An editor writing new copy can insert a real link instead and never touch
   * the token.
   */
  email?: string;
};

const LINK_CLASS =
  "text-primary-deep underline decoration-primary/40 underline-offset-[5px] transition-colors duration-300 hover:decoration-primary";

/** The `{email}` substitution, applied to plain strings and to rich text alike. */
function withEmail(text: string, email?: string) {
  if (!email || !text.includes("{email}")) return text;
  return text.split("{email}").map((part, index, all) => (
    <Fragment key={index}>
      {part}
      {index < all.length - 1 ? (
        <a href={`mailto:${email}`} className={LINK_CLASS}>
          {email}
        </a>
      ) : null}
    </Fragment>
  ));
}


/**
 * Turns the `{email}` token inside rich text into a real link, at render time.
 *
 * The address is never written into the CMS — it comes from the property
 * document, so the band cannot disagree with the footer, which is the whole
 * reason the token exists. That means the substitution cannot happen in the
 * migration either: it has to happen here, by splitting the span that holds
 * the token and giving the middle piece a link mark this renderer already
 * knows how to draw.
 *
 * Returns the original array untouched when there is nothing to replace, so
 * the common case allocates nothing.
 */
function substituteEmail(blocks: PortableTextBlock[], email?: string): PortableTextBlock[] {
  if (!email) return blocks;
  const TOKEN = "{email}";
  let found = false;
  const out = blocks.map((block) => {
    const typed = block as unknown as {
      _type?: string;
      _key?: string;
      children?: { _type?: string; _key?: string; text?: string; marks?: string[] }[];
      markDefs?: unknown[];
    };
    if (typed._type !== "block" || !Array.isArray(typed.children)) return block;
    if (!typed.children.some((child) => child?.text?.includes(TOKEN))) return block;

    found = true;
    const markKey = `email-${typed._key ?? "0"}`;
    const children: typeof typed.children = [];
    for (const child of typed.children) {
      const text = child?.text ?? "";
      if (!text.includes(TOKEN)) {
        children.push(child);
        continue;
      }
      const parts = text.split(TOKEN);
      parts.forEach((part, index) => {
        if (part) {
          children.push({ ...child, _key: `${child._key}-t${index}`, text: part });
        }
        if (index < parts.length - 1) {
          children.push({
            _type: "span",
            _key: `${child._key}-e${index}`,
            text: email,
            marks: [...(child.marks ?? []), markKey],
          });
        }
      });
    }
    return {
      ...typed,
      children,
      markDefs: [
        ...((typed.markDefs as { _key?: string }[]) ?? []),
        { _type: "textLink", _key: markKey, href: `mailto:${email}` },
      ],
    } as unknown as PortableTextBlock;
  });
  return found ? out : blocks;
}

function buildComponents(
  paragraphClassName: string,
  firstClassName: string,
  restClassName: string,
  blocks: PortableTextBlock[],
): PortableTextComponents {
  // Which block is first decides the opening margin, and `index` is not on
  // the props the renderer passes — so the block's own `_key` is matched
  // against the first one in the array.
  const firstKey = (blocks[0] as { _key?: string } | undefined)?._key;
  const spacing = (key: string | undefined) =>
    key !== undefined && key === firstKey ? firstClassName : restClassName;
  const join = (...parts: string[]) => parts.filter(Boolean).join(" ");

  return {
    block: {
      normal: ({ children, value }) => (
        <p className={join(spacing(value?._key), paragraphClassName)}>{children}</p>
      ),
      // H3 and H4 only. These fields sit under a band heading that is already
      // an H2 (or lower, when an editor has set one), so a heading inside the
      // body is a subheading by definition — see `headingLevelField`.
      h3: ({ children, value }) => (
        <h3
          className={join(
            spacing(value?._key),
            "font-heading text-[20px] leading-[1.3] font-light text-ink md:text-[23px]",
          )}
        >
          {children}
        </h3>
      ),
      h4: ({ children, value }) => (
        <h4
          className={join(
            spacing(value?._key),
            "font-heading text-[18px] leading-[1.35] font-light text-ink md:text-[20px]",
          )}
        >
          {children}
        </h4>
      ),
      blockquote: ({ children, value }) => (
        <blockquote
          className={join(
            spacing(value?._key),
            "border-l-2 border-primary pl-5 text-[18px] leading-[1.7] font-light text-ink italic md:text-[20px]",
          )}
        >
          {children}
        </blockquote>
      ),
    },
    list: {
      // The site's own bullet — a short gold rule, not a disc. Same treatment
      // as SanityPortableText and BulletListBlock, so a list reads the same
      // wherever it is authored.
      bullet: ({ children }) => <ul className="flex flex-col gap-3">{children}</ul>,
      number: ({ children }) => (
        <ol className="flex list-decimal flex-col gap-3 pl-5">{children}</ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => (
        <li className="grid grid-cols-[1.5rem_1fr] text-[17px] leading-[1.7] font-light text-text">
          <span aria-hidden className="mt-[0.85em] block h-px w-3.5 bg-primary" />
          <span className="break-words text-pretty">{children}</span>
        </li>
      ),
      number: ({ children }) => (
        <li className="text-[17px] leading-[1.7] font-light break-words text-pretty text-text">
          {children}
        </li>
      ),
    },
    marks: {
      strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
      em: ({ children }) => <em className="italic">{children}</em>,
      textLink: ({ value, children }) => {
        // `href` is a string whichever way it was authored: an internal
        // reference is resolved to a path by `linkProjection` in
        // lib/queries.ts. A half-filled annotation renders as plain text
        // rather than as a link to nowhere.
        const href: string | undefined = value?.href;
        if (!href) return <>{children}</>;
        // A mail or telephone link is a plain `<a>` with no target: there is
        // no tab to open, and this is the markup the hand-written pages emit,
        // so a CMS page and a coded one stay byte-identical.
        if (/^(mailto:|tel:)/.test(href)) {
          return (
            <a href={href} className={LINK_CLASS}>
              {children}
            </a>
          );
        }
        // `noreferrer` implies `noopener`, which closes the reverse-tabnabbing
        // hole a bare target="_blank" opens.
        if (value?.blank || /^https?:\/\//.test(href)) {
          return (
            <a href={href} target="_blank" rel="noreferrer" className={LINK_CLASS}>
              {children}
            </a>
          );
        }
        return (
          <Link href={href} className={LINK_CLASS}>
            {children}
          </Link>
        );
      },
    },
    types: {},
    unknownMark: ({ children }) => <>{children}</>,
    // Plain text for anything a newer schema offers than this deployment
    // knows about, rather than a blank where a paragraph should be.
    unknownType: ({ children }) => <>{children}</>,
  };
}

export function RichProse({
  value,
  paragraphClassName,
  firstClassName = "",
  restClassName = "",
  email,
}: RichProseProps) {
  if (!value || (Array.isArray(value) && !value.length)) return null;

  if (isBlocks(value)) {
    const blocks = substituteEmail(value, email);
    return (
      <PortableText
        value={blocks}
        components={buildComponents(
          paragraphClassName,
          firstClassName,
          restClassName,
          blocks,
        )}
      />
    );
  }

  // The pre-migration shape, and the shape `src/data` still holds. Rendered
  // by the same rules so a page cannot look different depending on where its
  // copy came from.
  const paragraphs = asParagraphs(value);
  return (
    <>
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className={[index === 0 ? firstClassName : restClassName, paragraphClassName]
            .filter(Boolean)
            .join(" ")}
        >
          {withEmail(paragraph, email)}
        </p>
      ))}
    </>
  );
}

export default RichProse;
