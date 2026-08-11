// ======================================================
// Route Information
// Original WordPress URLs (4 aktivitas budaya):
// /ubud/balinese-culture/balinese-class                    (WP 297)
// /ubud/balinese-culture/cooking-class                     (WP 381)
// /ubud/balinese-culture/melukat-purification-ceremony     (WP 289)
// /ubud/balinese-culture/rice-field-walk                   (WP 281)
//
// Current Next.js Route:
// src/app/ubud/balinese-culture/[...activity]/page.tsx
// Route statis /ubud/balinese-culture (indeks) menang atas catch-all ini.
//
// Jika slug berubah: ubah `slug` di src/data/experiences.ts, lalu perbarui CTA
// "Details" di src/app/ubud/balinese-culture/page.tsx, tautan "Discover more"
// di src/app/ubud/dining/page.tsx, dan src/app/complimentary-services/page.tsx.
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
const PREFIX = "balinese-culture/";
const ITEMS = EXPERIENCES.filter((e) => e.slug.startsWith(PREFIX));

type Params = { activity: string[] };

export function generateStaticParams(): Params[] {
  return ITEMS.map((e) => ({
    activity: e.slug.replace(PREFIX, "").split("/"),
  }));
}

export const dynamicParams = false;

const find = (s: string[]) =>
  ITEMS.find((e) => e.slug === PREFIX + s.join("/"));

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  // Title and description come from the live site, keyed by published
  // path — see src/data/seo.ts.
  return seo(`/ubud/balinese-culture/${(await params).activity.join("/")}`);
}

export default async function CultureActivityPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const item = find((await params).activity);
  if (!item) notFound();

  return (
    <>
      <PropertyHeader site={site} activeHref="/ubud/balinese-culture" />
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
