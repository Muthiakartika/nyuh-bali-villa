import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { DirectBookingDeals } from "@/components/property/DirectBookingDeals";
import { PropertyHero } from "@/components/property/PropertyHero";
import { PostBody } from "@/components/property/PostBody";
import { PostGrid } from "@/components/property/PostGrid";
import { ReadingProgress } from "@/components/property/ReadingProgress";
import { AwardsRow } from "@/components/property/AwardsRow";
import { PROPERTY_SITES } from "@/data/properties";
import { POSTS, type Post } from "@/data/posts";

type PostPageProps = { post: Post };

/**
 * A whole blog-post page — chrome, hero, body and "more from the blog".
 *
 * The live site scatters posts across several URL prefixes (/ubud/discover/,
 * /ubud/spa/, /ubud/retreat/, a bare /life-coach-retreat-benefits/ and even a
 * misspelt /ubud/discoverl/). Each of those needs its own Next.js route
 * segment to keep the published URL identical, so the *page* lives here once
 * and every route file is a thin wrapper that looks the post up and renders
 * this.
 */
export function PostPage({ post }: PostPageProps) {
  const site = PROPERTY_SITES[post.property];

  // Three more posts from the same property, newest first, excluding this one.
  const related = POSTS.filter(
    (p) => p.property === post.property && p.path !== post.path,
  ).slice(0, 3);

  return (
    <>
      <PropertyHeader site={site} activeHref={`/${post.property}/discover`} />
      {/* Article pages only — it would be meaningless on a listing page. */}
      <ReadingProgress />
      <main>
        <PropertyHero
          images={[post.image]}
          alt={post.title}
          eyebrow="Our Blog"
          title={post.title}
        />

        <PostBody post={post} />

        {related.length ? (
          // `featured={false}`: this is a "more from the blog" footer, so the
          // three cards stay an even row. Leading one of them at full width
          // would out-shout the article the reader is already on.
          <PostGrid
            heading="Our Blog"
            posts={related}
            tone="sand-deep"
            featured={false}
          />
        ) : null}

        <AwardsRow variant={site.awards.variant} badges={site.awards.badges} />
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}

/** Shared lookup so every post route resolves paths the same way. */
export function findPost(path: string) {
  return POSTS.find((p) => p.path === path);
}
