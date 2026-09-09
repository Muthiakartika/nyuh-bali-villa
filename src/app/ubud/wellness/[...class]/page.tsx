// ======================================================
// Route Information
// Original WordPress URLs (7 kelas wellness):
// /ubud/wellness/yoga             (WP 268)
// /ubud/wellness/sound-healing    (WP 118430)
// /ubud/wellness/breathwork       (WP 118437)
// /ubud/wellness/body-tone-flow   (WP 118435)
// /ubud/wellness/life-coach       (WP 118456)
// /ubud/wellness/reiki-healing    (WP 118427)
// /ubud/wellness/chakra-healing   (WP 119870)
//
// Current Next.js Route:
// src/app/ubud/wellness/[...class]/page.tsx
// Route statis /ubud/wellness (indeks) menang atas catch-all ini.
//
// Jika slug berubah: ubah `slug` di src/data/experiences.ts, lalu perbarui CTA
// "Explore More" di src/app/ubud/wellness/page.tsx dan
// src/app/complimentary-services/page.tsx.
// ======================================================

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { DirectBookingDeals } from "@/components/property/DirectBookingDeals";
import { PropertyHero } from "@/components/property/PropertyHero";
import { ExperienceDetailBody } from "@/components/property/ExperienceDetail";
import { AwardsRow } from "@/components/property/AwardsRow";
import { getExperience, getExperiences, getPropertySite } from "@/sanity/lib/content";
import { resolveDocumentMetadata } from "@/sanity/lib/metadata";

const PREFIX = "wellness/";

type Params = { class: string[] };

/**
 * Slugs come from Sanity when experiences are published there and from
 * src/data/experiences.ts otherwise. `dynamicParams = false` makes this list
 * authoritative, so an experience published only in the CMS has to appear
 * here or it would 404.
 */
export async function generateStaticParams(): Promise<Params[]> {
  const experiences = await getExperiences();
  return experiences
    .filter((experience) => experience.slug.startsWith(PREFIX))
    .map((experience) => ({
      class: experience.slug.slice(PREFIX.length).split("/"),
    }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  // The published experience's own SEO fields win; anything it leaves empty
  // falls back to the live site's title and description in src/data/seo.ts.
  const tail = (await params).class.join("/");
  return resolveDocumentMetadata(
    `/ubud/wellness/${tail}`,
    await getExperience(PREFIX + tail),
  );
}

export default async function WellnessClassPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const item = await getExperience(PREFIX + (await params).class.join("/"));
  if (!item) notFound();
  const site = await getPropertySite("ubud");

  return (
    <>
      <PropertyHeader site={site} activeHref="/ubud/wellness" />
      <main>
        <PropertyHero
          images={[item.hero]}
          alt={item.title}
          eyebrow={item.eyebrow}
          title={item.title}
        />
        <ExperienceDetailBody experience={item} site={site} />
        <AwardsRow variant={site.awards.variant} badges={site.awards.badges} />
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
