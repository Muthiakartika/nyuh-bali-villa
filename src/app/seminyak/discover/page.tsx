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
import ManagedPage from "@/components/sanity/ManagedPage";
import { getPropertySite, getPosts } from "@/sanity/lib/content";
import { resolvePageMetadata } from "@/sanity/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  // A published `page` document's SEO wins; otherwise this stays
  // exactly the live site's title and description from src/data/seo.ts.
  return resolvePageMetadata("/seminyak/discover");
}

const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads";

export default async function SeminyakBlogPage() {
  const site = await getPropertySite("seminyak");
  const posts = await getPosts("seminyak");
  return (
    <>
      <PropertyHeader site={site} activeHref="/seminyak/discover" />
      <main>
        {/* Everything below is the fallback: publish a `page`
            document at this path and its sections render
            instead, with the chrome unchanged. */}
        <ManagedPage path="/seminyak/discover" fallbackProperty="seminyak">
          <PropertyHero
            images={[`${UPLOADS}/2023/03/seminyak-slider.webp`]}
            alt="Stories from Nyuh Bali Villas Seminyak"
            eyebrow="Seminyak"
            title="Our Blog"
          />

          <PostGrid heading="Our Blog" posts={posts} tone="sand" />

          <AwardsRow variant={site.awards.variant} badges={site.awards.badges} />
        </ManagedPage>
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
