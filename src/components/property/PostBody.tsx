import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import type { Post, PostBlock } from "@/data/posts";

type PostBodyProps = { post: Post };

/** "2024-06-18" -> "18 June 2024". Fixed locale so the server and the client
 * can't disagree about the format and trigger a hydration mismatch. */
export function formatPostDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Derived from the post's own words — metadata, not written copy. 200 wpm is
 * the usual figure for adult reading of general prose. */
function readingMinutes(blocks: PostBlock[]) {
  const words = blocks.reduce((total, block) => {
    if (block.kind === "list") return total + block.items.join(" ").split(/\s+/).length;
    if (block.kind === "image") return total;
    return total + block.text.split(/\s+/).length;
  }, 0);
  return Math.max(1, Math.round(words / 200));
}

/**
 * A blog post's body, set as an editorial article rather than a blog page.
 *
 * **What changed and why.** The first version was one 680px column of uniform
 * 17px paragraphs — correct, and completely flat. For a resort whose entire
 * proposition is atmosphere, an article is a sales surface, so it is now
 * composed like a magazine feature:
 *
 *  - a **standfirst** (the post's own excerpt) set large under a date ·
 *    reading-time line, closed with the site's gold rule;
 *  - a **drop cap** on the opening paragraph — the cheapest, most legible
 *    signal that this is a feature and not a notice. Set in the heading face
 *    and `primary-deep`, so it costs no new token;
 *  - **photographs that break the measure** at `lg`, running wider than the
 *    text they sit in. DESIGN.md already names this as the thing that makes
 *    the layout read as editorial: contained text against uncontained image;
 *  - **section headings that announce themselves** — a short gold rule above,
 *    generous space before — instead of merely being bigger text;
 *  - body copy at 18px/1.8 rather than 17px/1.7, which is a reading measure
 *    for long form rather than for a card.
 *
 * The column is still `narrow` (680px ≈ 75 characters) — the one thing that
 * should never change on a page of prose.
 */
export function PostBody({ post }: PostBodyProps) {
  const minutes = readingMinutes(post.blocks);
  // The opening paragraph gets the drop cap; anything after it must not.
  const firstParagraph = post.blocks.findIndex((b) => b.kind === "paragraph");

  return (
    <Section tone="sand" width="narrow">
      {/* Byline row + standfirst. */}
      <Reveal>
        <p className="text-eyebrow font-body flex flex-wrap items-center gap-x-3 gap-y-1 text-primary-deep uppercase">
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          {/* The gold rule is the *visual* separator, but it's aria-hidden and
              carries no text — without this the two run together for a screen
              reader as "…2024 9 min read", or worse "20249". */}
          <span className="sr-only">, </span>
          <span aria-hidden className="block h-px w-4 bg-primary" />
          <span>{minutes} min read</span>
        </p>

        {post.excerpt ? (
          <p className="font-heading mt-6 text-[21px] leading-[1.55] font-light text-ink md:text-[25px]">
            {post.excerpt}
          </p>
        ) : null}

        <span aria-hidden className="mt-8 block h-px w-14 bg-primary" />
      </Reveal>

      <div className="mt-8 flex flex-col gap-6">
        {post.blocks.map((block, index) => {
          if (block.kind === "heading") {
            return (
              <div key={index} className="mt-6">
                <span aria-hidden className="block h-px w-10 bg-primary" />
                <h2 className="font-heading mt-5 text-[26px] leading-tight font-light text-ink md:text-[30px]">
                  {block.text}
                </h2>
              </div>
            );
          }

          if (block.kind === "list") {
            return (
              <ul key={index} className="flex flex-col gap-2.5">
                {block.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3.5 text-[18px] leading-[1.8] font-light text-text"
                  >
                    <span
                      aria-hidden
                      className="mt-3.5 block h-px w-3.5 shrink-0 bg-primary"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            );
          }

          if (block.kind === "image") {
            return (
              // Breaks the 680px measure at `lg` only: 900px needs a viewport
              // wide enough to hold it plus the section's own padding
              // (900 + 64 = 964 < 1024), so on a phone or tablet it stays
              // inside the column and can't cause a horizontal scroll.
              <div
                key={index}
                className="my-4 lg:-mx-[110px] lg:w-[calc(100%+220px)]"
              >
                <Image
                  src={block.src}
                  alt=""
                  width={900}
                  height={600}
                  sizes="(min-width: 1024px) 900px, 100vw"
                  className="h-auto w-full"
                />
              </div>
            );
          }

          const isOpener = index === firstParagraph;
          return (
            <p
              key={index}
              className={`text-[18px] leading-[1.8] font-light text-text ${
                isOpener
                  ? // Drop cap: heading face, gold, three lines deep. `float-left`
                    // rather than a grid so the following lines wrap around it.
                    "first-letter:font-heading first-letter:mt-1.5 first-letter:mr-3 first-letter:float-left first-letter:text-[58px] first-letter:leading-[0.78] first-letter:font-light first-letter:text-primary-deep md:first-letter:text-[68px]"
                  : ""
              }`}
            >
              {block.text}
            </p>
          );
        })}
      </div>

      {/* Closing rule + a way back into the blog. "Our Blog" is a string the
          site already uses (the footer column heading); no new copy. */}
      <Reveal>
        <div className="mt-12 border-t border-ink/10 pt-7">
          <Link
            href={`/${post.property}/discover`}
            className="text-eyebrow font-body group/back inline-flex items-center gap-3 text-primary-deep uppercase"
          >
            <span
              aria-hidden
              className="block h-px w-6 bg-primary transition-all duration-500 ease-out group-hover/back:w-10"
            />
            Our Blog
          </Link>
        </div>
      </Reveal>
    </Section>
  );
}
