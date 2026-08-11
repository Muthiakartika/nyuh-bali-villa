// ======================================================
// Route Information
// Original WordPress URLs (2 halaman, template Oxygen yang sama seperti Ubud):
// /seminyak/villa/honeymoon        (WP 19)  - Honeymoon Suite Pool Villa
// /seminyak/villa/honeymoon/pool   (WP 16)  - One Bedroom Pool Villa
//
// Current Next.js Route:
// src/app/seminyak/villa/[...room]/page.tsx  (catch-all, di-prerender via
// generateStaticParams dari ROOM_DETAILS di src/data/rooms.ts)
//
// Catatan: route statis /seminyak/villa dan
// /seminyak/villa/honeymoon/packages menang atas catch-all ini, jadi keduanya
// tidak tertimpa meskipun segmennya beririsan.
//
// Jika slug berubah, perbarui:
// - field `slug` pada src/data/rooms.ts (BUKAN nama folder — folder ini generic)
// - internal links: src/app/seminyak/villa/page.tsx (detailsHref tiap Room),
//   src/app/seminyak/page.tsx (LinkCardGrid "Our Villas")
// - breadcrumb: belum ada breadcrumb di project ini
// - sitemap: belum ada sitemap.ts; tambahkan route baru di sana jika dibuat
// ======================================================

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { DirectBookingDeals } from "@/components/property/DirectBookingDeals";
import { PropertyHero } from "@/components/property/PropertyHero";
import { RoomDetailBody } from "@/components/property/RoomDetail";
import { AwardsRow } from "@/components/property/AwardsRow";
import { PROPERTY_SITES } from "@/data/properties";
import { ROOM_DETAILS } from "@/data/rooms";
import { seo } from "@/data/seo";

const site = PROPERTY_SITES.seminyak;
const ROOMS = ROOM_DETAILS.filter((r) => r.property === "seminyak");

type Params = { room: string[] };

export function generateStaticParams(): Params[] {
  return ROOMS.map((r) => ({ room: r.slug.split("/") }));
}

export const dynamicParams = false;

function findRoom(segments: string[]) {
  return ROOMS.find((r) => r.slug === segments.join("/"));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  // Title and description come from the live site, keyed by published
  // path — see src/data/seo.ts.
  return seo(`/seminyak/villa/${(await params).room.join("/")}`);
}

export default async function SeminyakRoomDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const room = findRoom((await params).room);
  if (!room) notFound();

  return (
    <>
      <PropertyHeader site={site} activeHref="/seminyak/villa" />
      <main>
        <PropertyHero
          images={[room.hero]}
          alt={room.title}
          eyebrow="Villas"
          title={room.title}
        />
        <RoomDetailBody room={room} site={site} />
        <AwardsRow variant={site.awards.variant} badges={site.awards.badges} />
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
