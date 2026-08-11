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
import { PROPERTY_SITES } from "@/data/properties";
import { EXPERIENCES } from "@/data/experiences";
import { seo } from "@/data/seo";

const site = PROPERTY_SITES.ubud;
const ITEMS = EXPERIENCES.filter((e) => e.slug.startsWith("wellness/"));

type Params = { class: string[] };

export function generateStaticParams(): Params[] {
  return ITEMS.map((e) => ({
    class: e.slug.replace("wellness/", "").split("/"),
  }));
}

export const dynamicParams = false;

const find = (s: string[]) =>
  ITEMS.find((e) => e.slug === "wellness/" + s.join("/"));

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  // Title and description come from the live site, keyed by published
  // path — see src/data/seo.ts.
  return seo(`/ubud/wellness/${(await params).class.join("/")}`);
}

export default async function WellnessClassPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const item = find((await params).class);
  if (!item) notFound();

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
