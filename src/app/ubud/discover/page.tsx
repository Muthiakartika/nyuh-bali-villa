// ======================================================
// Route Information
// Original WordPress URL:
// /ubud/discover/          (WP page ID 119473, "Ubud - Blog")
//
// Current Next.js Route:
// src/app/ubud/discover/page.tsx
//
// Jika slug berubah, perbarui:
// - nama folder: src/app/ubud/discover/ (beserta subfolder [slug])
// - internal links: src/components/property/PropertyFooter.tsx (kolom
//   "Our Blog" dan menu "Blog")
// - src/components/property/PostPage.tsx (activeHref)
// - sitemap: belum ada sitemap.ts; tambahkan route baru di sana jika dibuat
//
// Catatan: indeks ini menampilkan SEMUA post Ubud, termasuk yang URL-nya tidak
// berada di bawah /ubud/discover/ (mis. /ubud/spa/flower-bath) — sama seperti
// blog live, yang mengumpulkan post dari beberapa prefix.
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
  return resolvePageMetadata("/ubud/discover");
}

const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads";

export default async function UbudBlogPage() {
  const site = await getPropertySite("ubud");
  const posts = await getPosts("ubud");
  return (
    <>
      <PropertyHeader site={site} activeHref="/ubud/discover" />
      <main>
        {/* Everything below is the fallback: publish a `page`
            document at this path and its sections render
            instead, with the chrome unchanged. */}
        <ManagedPage path="/ubud/discover" fallbackProperty="ubud">
          <PropertyHero
            images={[`${UPLOADS}/2023/05/IS_06578-min.webp`]}
            alt="Stories from Ubud Nyuh Bali Resort"
            eyebrow="Ubud"
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
