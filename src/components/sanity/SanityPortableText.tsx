import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { resolveImageUrl } from "@/sanity/lib/image";

/**
 * Portable Text rendered in the site's own type scale.
 *
 * Only `richTextSection` uses this. Blog articles deliberately do not — they
 * are typed `ArticleBlock`s, for the reasons `postBlocks.ts` sets out — so
 * this is the one place an editor gets free-form prose, and it is kept to the
 * marks the schema actually offers.
 */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mt-6 text-[17px] leading-[1.85] font-light break-words text-pretty text-text first:mt-0 md:text-[19px]">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="font-heading mt-12 text-[24px] leading-[1.2] font-light text-balance text-ink first:mt-0 md:text-[29px]">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-heading mt-9 text-[20px] leading-[1.3] font-light text-balance text-ink first:mt-0 md:text-[23px]">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-8 border-l-2 border-primary pl-5 text-[18px] leading-[1.7] font-light text-ink italic md:text-[20px]">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mt-6 flex flex-col gap-3">{children}</ul>,
    number: ({ children }) => (
      <ol className="mt-6 flex list-decimal flex-col gap-3 pl-5">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="grid grid-cols-[1.5rem_1fr] text-[17px] leading-[1.85] font-light text-text md:text-[19px]">
        <span aria-hidden className="mt-[0.85em] block h-px w-3.5 bg-primary" />
        <span className="break-words text-pretty">{children}</span>
      </li>
    ),
    number: ({ children }) => (
      <li className="text-[17px] leading-[1.85] font-light break-words text-pretty text-text md:text-[19px]">
        {children}
      </li>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    textLink: ({ value, children }) => {
      const href: string = value?.href ?? "#";
      const className =
        "text-primary-deep underline decoration-primary/40 underline-offset-[5px] transition-colors duration-300 hover:decoration-primary";
      // An off-site destination gets the new tab and the rel guard; an
      // internal one goes through Link so navigation stays client-side.
      if (value?.blank || /^https?:\/\//.test(href)) {
        return (
          <a href={href} target="_blank" rel="noreferrer" className={className}>
            {children}
          </a>
        );
      }
      return (
        <Link href={href} className={className}>
          {children}
        </Link>
      );
    },
  },
  types: {
    imageWithAlt: ({ value }) => {
      const src = resolveImageUrl(value);
      if (!src) return null;
      return (
        <figure className="mt-10">
          <div className="relative aspect-[3/2] w-full overflow-hidden">
            <Image
              src={src}
              alt={value?.alt ?? ""}
              fill
              sizes="(min-width: 1024px) 680px, 100vw"
              className="object-cover"
            />
          </div>
          {value?.caption ? (
            <figcaption className="text-eyebrow font-body mt-3 text-primary-deep uppercase">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
  },
};

export default function SanityPortableText({ value }: { value: PortableTextBlock[] }) {
  if (!value?.length) return null;
  return <PortableText value={value} components={components} />;
}
