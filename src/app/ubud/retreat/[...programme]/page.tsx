// ======================================================
// Route Information
// Original WordPress URLs (6 program retreat):
// /ubud/retreat/couples                      (WP 118384)
// /ubud/retreat/slimming                     (WP 119176)
// /ubud/retreat/luxury/anti-aging            (WP 119522)
// /ubud/retreat/luxury/balinese-healing      (WP 118374)
// /ubud/retreat/luxury/holistic-balancing    (WP 118380)
// /ubud/retreat/luxury/new-beginning         (WP 118382)
//
// Current Next.js Route:
// src/app/ubud/retreat/[...programme]/page.tsx
//
// Route statis /ubud/retreat, /ubud/retreat/luxury dan
// /ubud/retreat/host-your-own menang atas catch-all ini.
//
// Jika slug berubah: ubah field `slug` di src/data/experiences.ts, lalu
// perbarui CTA "Explore More" di src/app/ubud/retreat/luxury/page.tsx dan
// src/app/ubud/packages/page.tsx.
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

const site = PROPERTY_SITES.ubud;
const ITEMS = EXPERIENCES.filter((e) => e.slug.startsWith("retreat/"));

type Params = { programme: string[] };

export function generateStaticParams(): Params[] {
  return ITEMS.map((e) => ({
    programme: e.slug.replace("retreat/", "").split("/"),
  }));
}

export const dynamicParams = false;

const find = (s: string[]) =>
  ITEMS.find((e) => e.slug === "retreat/" + s.join("/"));

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const item = find((await params).programme);
  return {
    title: item ? `${item.title} - Ubud Nyuh Bali Resort` : "Not found",
  };
}

export default async function RetreatProgrammePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const item = find((await params).programme);
  if (!item) notFound();

  return (
    <>
      <PropertyHeader site={site} activeHref="/ubud/retreat" />
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
