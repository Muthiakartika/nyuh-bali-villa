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
import { PROPERTY_SITES } from "@/data/properties";
import { POSTS } from "@/data/posts";
import { seo } from "@/data/seo";

export const metadata: Metadata = seo("/ubud/discover");

const site = PROPERTY_SITES.ubud;
const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads";
const ubudPosts = POSTS.filter((p) => p.property === "ubud");

export default function UbudBlogPage() {
  return (
    <>
      <PropertyHeader site={site} activeHref="/ubud/discover" />
      <main>
        <PropertyHero
          images={[`${UPLOADS}/2023/05/IS_06578-min.webp`]}
          alt="Stories from Ubud Nyuh Bali Resort"
          eyebrow="Ubud"
          title="Our Blog"
        />

        <PostGrid heading="Our Blog" posts={ubudPosts} tone="sand" />

        <AwardsRow variant={site.awards.variant} badges={site.awards.badges} />
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
