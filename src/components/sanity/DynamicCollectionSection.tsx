import { LinkCardGrid } from "@/components/property/LinkCardGrid";
import { PostGrid } from "@/components/property/PostGrid";
import { RoomList } from "@/components/property/RoomList";
import { TestimonialCarousel } from "@/components/property/TestimonialCarousel";
import type { PropertySite, PropertySlug } from "@/data/properties";
import { getExperiences, getPosts, getRooms, getTestimonials } from "@/sanity/lib/content";
import type { SanitySection } from "@/sanity/types";

type CollectionSection = Extract<SanitySection, { _type: "collectionSection" }>;

/**
 * A section that lists documents instead of restating them.
 *
 * The alternative was making an editor paste every room into every page that
 * lists it, which is the duplication the room documents exist to remove. Each
 * branch resolves through the same fallback layer as the routes, so an
 * unpublished collection quietly falls back to `src/data` rather than
 * rendering an empty band.
 */
export default async function DynamicCollectionSection({
  section,
  site,
}: {
  section: CollectionSection;
  site: PropertySite;
}) {
  const property = (section.property || undefined) as PropertySlug | undefined;
  const limit = section.limit ?? undefined;
  const take = <T,>(items: T[]) => (limit ? items.slice(0, limit) : items);

  if (section.collection === "room") {
    const all = await getRooms(property ?? site.slug);
    // An explicit slug list keeps a page's own selection *and its order* —
    // Ubud's Stay page lists its suites and its villas as two separate bands,
    // which listing "every room of the property" cannot express.
    const chosen = section.slugs?.length
      ? section.slugs.flatMap((slug) => all.filter((room) => room.slug === slug))
      : all;
    const rooms = take(chosen);
    if (!rooms.length) return null;
    return (
      <RoomList
        eyebrow={section.eyebrow}
        heading={section.heading ?? ""}
        intro={section.intro}
        tone={section.tone}
        rooms={rooms.map((room) => ({
          name: room.title,
          images: room.gallery.length ? room.gallery : [room.hero],
          bed: room.details.find((d) => /bed/i.test(d.label))?.value ?? "",
          size: room.details.find((d) => /size/i.test(d.label))?.value ?? "",
          occupancy: room.details.find((d) => /occupan/i.test(d.label))?.value ?? "",
          ratesHref: site.bookingHref,
          detailsHref: `/${room.property}/villa/${room.slug}`,
          detailsInScope: true,
        }))}
      />
    );
  }

  if (section.collection === "post") {
    const posts = take(await getPosts(property));
    if (!posts.length) return null;
    return (
      <PostGrid
        eyebrow={section.eyebrow}
        heading={section.heading ?? "Our Blog"}
        posts={posts}
        tone={section.tone}
      />
    );
  }

  if (section.collection === "experience") {
    const all = await getExperiences();
    const filtered = section.group ? all.filter((e) => e.group === section.group) : all;
    const items = take(filtered).flatMap((experience) =>
      experience.hero
        ? [
            {
              label: experience.title,
              href: `/ubud/${experience.slug}`,
              imgSrc: experience.hero,
              inScope: true,
            },
          ]
        : [],
    );
    if (!items.length) return null;
    return (
      <LinkCardGrid
        eyebrow={section.eyebrow}
        heading={section.heading ?? ""}
        items={items}
        columns={3}
        tone={section.tone}
      />
    );
  }

  // Quotes written into the section win over the property's testimonial
  // documents: the spa, dining and offers pages each carry their own selection,
  // and those are page copy rather than the property's general reviews.
  const inline = (section.quotes ?? []).flatMap((item) =>
    item.quote ? [{ quote: item.quote, author: item.author }] : [],
  );
  const testimonials = inline.length
    ? take(inline)
    : take(await getTestimonials(property ?? site.slug));
  if (!testimonials.length) return null;
  return <TestimonialCarousel testimonials={testimonials} />;
}
