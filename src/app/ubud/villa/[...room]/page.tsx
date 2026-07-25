// ======================================================
// Route Information
// Original WordPress URLs (8 halaman, satu template Oxygen):
// /ubud/villa/suite                    (WP 184)
// /ubud/villa/honeymoon/pool           (WP 192)
// /ubud/villa/1-bedroom-pool-deluxe    (WP 200)
// /ubud/villa/1-bedroom-pool-royal     (WP 207)
// /ubud/villa/honeymoon                (WP 213)
// /ubud/villa/2-bedroom-pool           (WP 220)
// /ubud/villa/3-bedroom-pool           (WP 226)
// /ubud/villa/4-bedroom-pool           (WP 232)
//
// Current Next.js Route:
// src/app/ubud/villa/[...room]/page.tsx  (catch-all, di-prerender via
// generateStaticParams dari ROOM_DETAILS di src/data/rooms.ts)
//
// Kenapa catch-all: slug kamar punya kedalaman berbeda — "suite" satu segmen,
// "honeymoon/pool" dua segmen. Route statis /ubud/villa dan
// /ubud/villa/honeymoon/packages tetap menang atas catch-all ini (Next.js
// memprioritaskan route statis), jadi keduanya tidak tertimpa.
//
// Jika slug berubah, perbarui:
// - field `slug` pada src/data/rooms.ts (BUKAN nama folder — folder ini generic)
// - internal links: src/app/ubud/villa/page.tsx (detailsHref tiap Room)
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

const site = PROPERTY_SITES.ubud;
const ROOMS = ROOM_DETAILS.filter((r) => r.property === "ubud");

type Params = { room: string[] };

export function generateStaticParams(): Params[] {
  return ROOMS.map((r) => ({ room: r.slug.split("/") }));
}

/** Nothing outside the eight known slugs should render. */
export const dynamicParams = false;

function findRoom(segments: string[]) {
  return ROOMS.find((r) => r.slug === segments.join("/"));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const room = findRoom((await params).room);
  return {
    title: room ? `${room.title} - Ubud Nyuh Bali Resort` : "Not found",
  };
}

export default async function UbudRoomDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const room = findRoom((await params).room);
  if (!room) notFound();

  return (
    <>
      <PropertyHeader site={site} activeHref="/ubud/villa" />
      <main>
        <PropertyHero
          images={[room.hero]}
          alt={room.title}
          eyebrow="Stay"
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
