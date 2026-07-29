import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { formatPostDate, readingMinutes } from "@/components/property/PostBody";
import type { Post } from "@/data/posts";

/** `18 June 2024 · 7 min read`. The gold rule is the visual separator but
 * carries no text, so a comma is voiced in its place — otherwise a screen
 * reader runs the two together as "2024 7 min read". */
function PostMeta({ post }: { post: Post }) {
  return (
    <p className="text-eyebrow font-body flex flex-wrap items-center gap-x-3 gap-y-1 text-primary-deep uppercase">
      <time dateTime={post.date}>{formatPostDate(post.date)}</time>
      <span className="sr-only">, </span>
      <span aria-hidden className="block h-px w-4 bg-primary" />
      <span>{readingMinutes(post.blocks)} min read</span>
    </p>
  );
}

type PostGridProps = {
  eyebrow?: string;
  heading: string;
  posts: Post[];
  tone?: "sand" | "sand-deep";
  /**
   * Lead with one large post, then run the rest as a grid. Defaults on when
   * there are enough posts to make a "rest" (4+); a 2- or 3-post list has no
   * hierarchy to express, so it stays an even row.
   */
  featured?: boolean;
};

/** One card in the lower grid. Kept in one place so the two grids below the
 * lead can't drift apart. */
function PostCard({ post, priority = false }: { post: Post; priority?: boolean }) {
  return (
    <article className="h-full">
      <Link href={post.path} className="group/card flex h-full flex-col">
        <div className="relative h-52 w-full overflow-hidden md:h-60">
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-[900ms] ease-out group-hover/card:scale-[1.05]"
            priority={priority}
          />
        </div>

        <div className="mt-5">
          <PostMeta post={post} />
        </div>

        <h3 className="font-heading mt-3 text-[20px] leading-snug font-light text-balance text-ink transition-colors duration-300 group-hover/card:text-primary-deep md:text-[22px]">
          {post.title}
        </h3>

        {post.excerpt ? (
          // Two lines is a promise of what the piece is about; more turns the
          // row of cards back into a wall of text, which is what the index
          // exists to avoid.
          <p className="mt-3 line-clamp-2 text-[15px] leading-[1.7] font-light text-text">
            {post.excerpt}
          </p>
        ) : null}

        {/* `mt-auto` on the wrapper pins the rule to the bottom of the tallest
            card in the row, so the gold marks line up across the grid even
            when one title wraps to three lines. The `pt-5` is the minimum gap
            when a card is the tallest and there is no slack to distribute. */}
        <div className="mt-auto pt-5">
          <span
            aria-hidden
            className="block h-px w-9 bg-primary transition-all duration-500 ease-out group-hover/card:w-20"
          />
        </div>
      </Link>
    </article>
  );
}

/**
 * The blog index listing.
 *
 * **Editorial hierarchy, not a uniform grid.** The first version ran every post
 * as the same card in one 3-across grid: with eight posts that reads as a
 * catalogue page, and nothing tells a visitor where to start. This leads with
 * the newest post at full width — photograph on one side, headline and excerpt
 * on the other — and runs the remainder as the compact card. One large item
 * plus one repeating size is how a magazine creates rhythm; it is *not* random
 * card sizes, which is exactly what `LinkCardGrid`'s fixed-height rule exists
 * to prevent.
 *
 * Everything else is the site's existing language: `object-cover` at a fixed
 * frame height (so no photograph can letterbox), square corners, the gold rule
 * that extends on hover, and a slow scale on the image. Title and date sit
 * *below* the photograph rather than over it — a headline has to stay readable
 * at length, which a label over a gradient does not.
 *
 * The lead splits at `lg`, never `md`, like every other split on this site.
 */
export function PostGrid({
  eyebrow,
  heading,
  posts,
  tone = "sand",
  featured,
}: PostGridProps) {
  const useFeature = (featured ?? posts.length >= 4) && posts.length > 0;
  const lead = useFeature ? posts[0] : null;
  const rest = useFeature ? posts.slice(1) : posts;

  return (
    <Section tone={tone}>
      <SectionHeading eyebrow={eyebrow} title={heading} />

      {lead ? (
        <Reveal>
          <article className="mt-8 md:mt-10">
            <Link
              href={lead.path}
              className="group/lead grid items-center gap-6 lg:grid-cols-12 lg:gap-x-12"
            >
              <div className="relative h-64 w-full overflow-hidden sm:h-80 lg:col-span-7 lg:h-[29rem]">
                <Image
                  src={lead.image}
                  alt={lead.title}
                  fill
                  sizes="(min-width: 1024px) 720px, 100vw"
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover/lead:scale-[1.04]"
                  priority
                />
              </div>

              <div className="lg:col-span-5">
                <PostMeta post={lead} />

                <h3 className="font-heading mt-4 text-[28px] leading-[1.15] font-light text-balance text-ink transition-colors duration-300 group-hover/lead:text-primary-deep md:text-[36px]">
                  {lead.title}
                </h3>

                <span
                  aria-hidden
                  className="mt-5 block h-px w-12 bg-primary transition-all duration-500 ease-out group-hover/lead:w-24"
                />

                {lead.excerpt ? (
                  <p className="mt-5 line-clamp-4 text-[16px] leading-[1.75] font-light text-text">
                    {lead.excerpt}
                  </p>
                ) : null}

                <span className="text-eyebrow font-body mt-7 inline-block text-primary-deep uppercase underline decoration-primary/40 underline-offset-[6px] transition-colors duration-300 group-hover/lead:decoration-primary">
                  Read more
                </span>
              </div>
            </Link>
          </article>
        </Reveal>
      ) : null}

      {rest.length ? (
        <div
          className={`grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 ${
            lead ? "mt-12 border-t border-ink/10 pt-10 md:mt-14" : "mt-8 md:mt-10"
          }`}
        >
          {rest.map((post, index) => (
            <Reveal key={post.path} delay={index * 80}>
              <PostCard post={post} priority={!lead && index === 0} />
            </Reveal>
          ))}
        </div>
      ) : null}
    </Section>
  );
}
