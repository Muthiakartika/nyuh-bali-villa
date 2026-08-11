// ======================================================
// Route Information
// Original WordPress URL:
// /seminyak/discover/      (WP page ID 119476, "Seminyak - Blog")
//
// Current Next.js Route:
// src/app/seminyak/discover/page.tsx
//
// Jika slug berubah, perbarui:
// - nama folder: src/app/seminyak/discover/ (beserta subfolder [slug])
// - internal links: src/components/property/PropertyFooter.tsx (kolom
//   "Our Blog" dan menu "Blog")
// - src/components/property/PostPage.tsx (activeHref)
// - sitemap: belum ada sitemap.ts; tambahkan route baru di sana jika dibuat
// ======================================================

import type { Metadata } from "next";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { DirectBookingDeals } from "@/components/property/DirectBookingDeals";
import { PropertyHero } from "@/components/property/PropertyHero";
import { PostGrid } from "@/components/property/PostGrid";
import { AwardsRow } from "@/components/property/AwardsRow";
import { PROPERTY_SITES } from "@/data/properties";
import { POSTS } from "@/data/posts";
import { seo } from "@/data/seo";

export const metadata: Metadata = seo("/seminyak/discover");

const site = PROPERTY_SITES.seminyak;
const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads";
const seminyakPosts = POSTS.filter((p) => p.property === "seminyak");

export default function SeminyakBlogPage() {
  return (
    <>
      <PropertyHeader site={site} activeHref="/seminyak/discover" />
      <main>
        <PropertyHero
          images={[`${UPLOADS}/2023/03/seminyak-slider.webp`]}
          alt="Stories from Nyuh Bali Villas Seminyak"
          eyebrow="Seminyak"
          title="Our Blog"
        />

        <PostGrid heading="Our Blog" posts={seminyakPosts} tone="sand" />

        <AwardsRow variant={site.awards.variant} badges={site.awards.badges} />
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
