// ======================================================
// Route Information
// Original WordPress URL:
// /seminyak/tour/          (WP page ID 158, "Seminyak - Explore Bali")
//
// Current Next.js Route:
// src/app/seminyak/tour/page.tsx
//
// Jika slug berubah, perbarui:
// - nama folder: src/app/seminyak/tour/ -> src/app/seminyak/<slug-baru>/
// - navigation: src/data/properties.ts -> PROPERTY_SITES.seminyak.navItems
//   ("Explore Bali")
// - internal links: src/app/seminyak/page.tsx (LinkCardGrid "Discover" ->
//   kartu "Explore Bali")
// - breadcrumb: belum ada breadcrumb di project ini
// - sitemap: belum ada sitemap.ts; tambahkan route baru di sana jika dibuat
//
// Catatan: tombol "Book Now" pada setiap tour menaut ke anchor #tour-booking
// di halaman yang sama (form di bawah). Jika id section form diubah, perbarui
// juga BOOKING_ANCHOR di bawah.
// ======================================================

import type { Metadata } from "next";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { DirectBookingDeals } from "@/components/property/DirectBookingDeals";
import { PropertyHero } from "@/components/property/PropertyHero";
import {
  PackageList,
  type PackageItem,
} from "@/components/property/PackageList";
import {
  InquiryForm,
  type InquiryField,
} from "@/components/property/InquiryForm";
import { AwardsRow } from "@/components/property/AwardsRow";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { PROPERTY_SITES } from "@/data/properties";

export const metadata: Metadata = {
  title: "Explore Bali - Private Tour from Seminyak - Nyuh Bali Villas",
};

const site = PROPERTY_SITES.seminyak;
const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads";

// Every tour's "Book Now" points here — the live page's buttons have no
// destination at all (href="http://"); the form below is what actually takes a
// tour booking, so linking to it is the honest reading of that intent.
const BOOKING_ANCHOR = "#tour-booking";

const HERO_IMAGES = [`${UPLOADS}/2023/03/Tour-Seminyak.webp`];

// The two open-ended charters. They have no photographs of their own on the
// live page, so both use the page's own header image.
const DAY_TRAVELLING: PackageItem[] = [
  {
    name: "Half Day Travelling",
    images: [`${UPLOADS}/2023/03/Tour-Seminyak.webp`],
    meta: [
      { label: "Price", value: "IDR 800.000 ++ / car" },
      { label: "Duration", value: "5 hours" },
    ],
    benefitsHeading: "Inclusions",
    benefits: [
      "Private air-conditioned transport",
      "Driver",
      "Petrol",
      "Parking Fee",
      "Refreshment (Mineral water, fruit skewers, and cold towel)",
    ],
    ctas: [{ label: "Book Now", href: BOOKING_ANCHOR, inScope: true }],
  },
  {
    name: "Full Day Travelling",
    images: [`${UPLOADS}/2023/03/Tour-Seminyak.webp`],
    meta: [
      { label: "Price", value: "IDR 1.250.000 ++ / car" },
      { label: "Duration", value: "10 hours" },
    ],
    benefitsHeading: "Inclusions",
    benefits: [
      "Private air-conditioned transport",
      "Driver",
      "Petrol",
      "Parking Fee",
      "Refreshment (Mineral water, fruit skewers, and cold towel)",
    ],
    ctas: [{ label: "Book Now", href: BOOKING_ANCHOR, inScope: true }],
  },
];

// The five fixed itineraries. `meta` carries the price/duration/itinerary
// block, `notes` the per-stop descriptions and the surcharge lines.
const TOURS: PackageItem[] = [
  {
    name: "Romancing Uluwatu",
    images: [
      `${UPLOADS}/2023/03/tour-uluwatu.webp`,
      `${UPLOADS}/2023/03/tour-kecak.webp`,
      `${UPLOADS}/2023/03/tour-padang-padang.webp`,
    ],
    description: "All Inclusive Package. Half day Tour depart from 15.00",
    meta: [
      { label: "Price", value: "IDR 1.390.000++ for two persons" },
      { label: "Duration", value: "6 hours" },
      {
        label: "Inclusions",
        value:
          "Private air-conditioned transport, driver, petrol, entrance tickets, kecak performance tickets, parking fee, mineral water, fruit juice, cold towel",
      },
      {
        label: "Itinerary",
        value: "Padang-padang Beach - Uluwatu Temple - Kecak Dance",
      },
    ],
    notes: [
      "Lunch Box : IDR 90.000 / person (Burger or sandwich)",
      "Additional person : IDR 300.000 ++ per person (Maximum 4 persons in one car)",
      "Padang Padang Beach features a simply stunning one hundred meter-long stretch of sand. It is accessible down a flight of stairs through a unique hollow rock entrance. Its golden sand and clear aqua waters are well worth a visit.",
      "Uluwatu Temple is one of the six key temples believed to protect the island from evil spirits in the southwest. It is definitely one of the top places on the island to go to for sunset delights, with direct views overlooking the beautiful Indian Ocean",
      "Kecak dance is derived from an old Balinese ritual called the sanghyang - a trance dance driven by its participants' repetitive chanting. No musical instruments are used in a Kecak performance - in- stead, you'll see about thirty bare-chested men sitting in a circle, uttering “chak... chak... chak” rhythmically and repetitively.",
    ],
    ctas: [{ label: "Book Now", href: BOOKING_ANCHOR, inScope: true }],
  },
  {
    name: "Exotic Sunset Tour",
    images: [
      `${UPLOADS}/2023/03/Taman-Ayun.webp`,
      `${UPLOADS}/2023/03/tanahlot.webp`,
    ],
    description: "All Inclusive Package. Half day Tour depart from 14.30",
    meta: [
      { label: "Price", value: "IDR 990.000++ for two persons" },
      { label: "Duration", value: "5 hours" },
      {
        label: "Inclusions",
        value:
          "Private air-conditioned transport, driver, petrol, entrance tickets, parking fee, mineral water, fruit juice, cold towel",
      },
      { label: "Itinerary", value: "Taman Ayun - Tanah Lot Temple" },
    ],
    notes: [
      "Lunch Box : IDR 90.000 / person (Burger or sandwich)",
      "Additional person : IDR 150.000 ++ per person (Maximum 4 persons in one car)",
      "Taman Ayun literally translates as ‘beautiful garden’. It’s is situated in a beautiful park with trees and ponds. Its entrance is bordered by broad canals and can only be entered through a bridge. It is one of the most underrated and photogenic temples, with a row of pagoda up to 11 stories tall.",
      "Tanah Lot Temple is known as the temple in the sea, this magnificent temple seemingly floating in the ocean for all to see. Sitting on a large offshore rock, Tanah Lot is dedicated to the deity of the Sea, Bhatara Sagara. You also can find small caves inhabited by sea snakes that believed as the guardian of the temple. Take a chance to see it if you are into.",
      "Many art shops sell souvenirs of all sorts and line the pathway from the parking area to the Tanah lot temple, with peddlers selling traditional Balinese snacks such as Jaja kelepon. Klepon is a boiled rice cake stuffed with liquid palm sugar and rolled in grated coconut. The color is green because it is coated with a paste made from pandan leaves.",
      "Tips: Bargaining is expected and indeed encouraged as part of the fun of shopping; do it nicely",
    ],
    ctas: [{ label: "Book Now", href: BOOKING_ANCHOR, inScope: true }],
  },
  {
    name: "Ubud City Tour",
    images: [
      `${UPLOADS}/2023/03/batuan-temple.webp`,
      `${UPLOADS}/2023/03/Sangeh-Monkey-Forest-800x533-1.webp`,
      `${UPLOADS}/2023/02/Why-Visit-The-Water-Palace-Ubud.webp`,
      `${UPLOADS}/2023/03/640px-Tegenungan_Waterfall_Ubud_Indonesia_-_panoramio_6.webp`,
    ],
    description: "All Inclusive Package. Full day Tour depart from 08.00",
    meta: [
      { label: "Price", value: "IDR 1.250.000++ for two persons" },
      { label: "Duration", value: "10 hours" },
      {
        label: "Inclusions",
        value:
          "Private air-conditioned transport, driver, petrol, entrance tickets, offering",
      },
      {
        label: "Itinerary",
        value:
          "Batuan Temple - Monkey Forest - Ubud Water Palace's - Tegenungan Waterfall",
      },
    ],
    notes: [
      "Lunch Box : IDR 90.000 / person (Burger or sandwich)",
      "Additional person : IDR 200.000 ++ per person (Maximum 4 persons in one car)",
      "Batuan Temple is located in the batuan village, a village that well-known for its traditional Balinese arts and paintings. The temple is designed very beautiful with full of Balinese ornaments and the roof temple building is made from the fiber of chromatic black palm tree.",
      "Monkey Forest is a natural forest sanctuary that a home to a horde of grey, long-tailed monkey. It offers a refreshing walk through a beautiful forest. Tips: Do not bring any bottles, cans, foods into the forest.",
      "Ubud Water Palace's also known as the Saraswati Temple. It is dedicated to the Goddess of knowledge. Abundance unique Balinese architecture and its charming lotus pond make this place should be highly considered on your itinerary. The scent of lotus flower will boost your mood instantly as you walk around the temple.",
      "Tegenungan Waterfall is very easy to access. The pathway is well maintained and very safe to explore. It's just a short walk down the concrete steps, and the safety rail leads you to the pit of the falls. You will also be able to swim at the foot of the waterfall.",
    ],
    ctas: [{ label: "Book Now", href: BOOKING_ANCHOR, inScope: true }],
  },
  {
    name: "Amazing Scenary Tour",
    images: [
      `${UPLOADS}/2023/03/Goa-Gajah-Bali.webp`,
      `${UPLOADS}/2023/03/Tegalalang-Rice-Terrace.webp`,
      `${UPLOADS}/2023/03/tirta-empul-tampaksiring.webp`,
      `${UPLOADS}/2023/03/batur.webp`,
    ],
    description: "All Inclusive Package. Full day Tour depart from 08.00",
    meta: [
      { label: "Price", value: "IDR 1.500.000++ for two persons" },
      { label: "Duration", value: "10 hours" },
      {
        label: "Inclusions",
        value:
          "Private air-conditioned transport, driver, petrol, entrance tickets, offering",
      },
      {
        label: "Itinerary",
        value:
          "Goa Gajah Temple - Tegalalang Rice Terrace - Tirta Empul - Mount Batur",
      },
    ],
    notes: [
      "Lunch Box : IDR 90.000 / person (Burger or sandwich)",
      "Additional person : IDR 250.000 ++ per person (Maximum 4 persons in one car)",
      "Goa Gajah temple was built in 11th century. It is an archaeological site of significant historical value that makes it a worth place to visit. It boasts stunning sceneries which enable people to enjoy walking over the bridges and along the rivers.",
      "Tegalalang Rice Terrace is famous for its beautiful scenes of rice paddies in Bali. The layers of dense green foliage creates an amazing pattern on the side of the hill, almost like a big-green-layer-cake.",
      "Tirta empul simply means holy spring water in English. The spring bubble up into a large clear pool within the temple. The 15 water fountains are believed to wash away your turmoil and prevent sickness. Tips: Please bring a change of clothes if you would like to bath in the Tirta Empul.",
      "Mount Batur is an active volcano that bordered by batur Lake. It offers the different angle of bali with the highland windy breeze and the beautiful view along the way. Tips: The weather is cool, so you may need to bring your light jacket or cardigan.",
    ],
    ctas: [{ label: "Book Now", href: BOOKING_ANCHOR, inScope: true }],
  },
  {
    name: "Countryside to Sunset Tour",
    images: [
      `${UPLOADS}/2023/03/Taman-Ayun.webp`,
      `${UPLOADS}/2023/03/jatiluwih.webp`,
      `${UPLOADS}/2023/03/ulun-danu-1.webp`,
      `${UPLOADS}/2023/03/tanahlot.webp`,
    ],
    description: "All Inclusive Package. Full day Tour depart from 08.00",
    meta: [
      { label: "Price", value: "IDR 1.550.000++ for two persons" },
      { label: "Duration", value: "10 hours" },
      {
        label: "Inclusions",
        value:
          "Private air-conditioned transport, driver, petrol, entrance tickets, offering, parking fee, mineral water, fruit juice, cold towel",
      },
      {
        label: "Itinerary",
        value:
          "Taman Ayun - Jatiluwih Rice Terrace - Ulun Danu Temple - Tanah Lot Temple",
      },
    ],
    notes: [
      "Lunch Box : IDR 90.000 / person (Burger or sandwich)",
      "Additional person : IDR 300.000 ++ per person (Maximum 4 persons in one car)",
      "Taman Ayun literally translates as 'beautiful garden'. It's is situated in a beautiful park with trees and ponds. Its entrance is bordered by broad canals and can only be entered through a bridge. It is one of the most underrated and photogenic temples, with a row of pagoda up to 11 stories tall.",
      "Jatiluwih Rice Terrace is appointed as one of the UNESCO world heritage sites due to the usage of a traditional water irrigation system that dates back as early as the 9th century. The rice terrace here is much bigger (600 hectares) and less crowded compared to the more popular Tegalalang Rice Terrace.",
      "Ulun Danu Temple is located on the shores of Lake Bratan. The smooth reflective surface of the lake surrounding most of the temple's base creates a unique floating impression, while the mountain range of the Bedugul encircles the lake as the backdrop.",
      "Tanah Lot Temple is known as the temple in the sea, this magnificent temple seemingly floating in the ocean for all to see. Sitting on a large offshore rock, Tanah Lot is dedicated to the deity of the Sea, Bhatara Sagara. You also can find small caves inhabited by sea snakes that believed as the guardian of the temple. Take a chance to see it if you are into.",
    ],
    ctas: [{ label: "Book Now", href: BOOKING_ANCHOR, inScope: true }],
  },
];

// The live tour booking form, field for field and in the same order.
const TOUR_FIELDS: InquiryField[] = [
  {
    kind: "radio",
    name: "package",
    label: "Package",
    required: true,
    options: [
      "Half Day Travelling",
      "Full Day Travelling",
      "Romancing Uluwatu",
      "Exotic Sunset Tour",
      "Ubud City Tour",
      "Amazing Scenary Tour",
      "Countryside to Sunset Tour",
    ],
  },
  { kind: "text", name: "name", label: "Name", required: true },
  {
    kind: "radio",
    name: "pax",
    label: "Number of pax",
    options: ["1", "2", "3", "4"],
  },
  { kind: "date", name: "date", label: "Date of choice" },
  {
    kind: "radio",
    name: "staying",
    label: "Do You Stay with Us",
    options: ["Yes", "No"],
  },
  { kind: "email", name: "email", label: "Email", required: true },
  { kind: "tel", name: "whatsapp", label: "WhatsApp" },
  { kind: "textarea", name: "message", label: "Your message (optional)" },
];

/**
 * Seminyak — Explore Bali. Order follows the live page: the "travel with us"
 * pitch, the two open charters, the five fixed itineraries, then the booking
 * form.
 *
 * The tours reuse `PackageList` rather than getting their own component — a
 * tour and a package are the same shape here (photographs, a pitch, what's
 * included, one action); `meta` is what carries a tour's price and itinerary.
 */
export default function SeminyakTourPage() {
  return (
    <>
      <PropertyHeader site={site} activeHref="/seminyak/tour" />
      <main>
        <PropertyHero
          images={HERO_IMAGES}
          alt="Private Bali tours from Nyuh Bali Villas Seminyak"
          eyebrow="Seminyak"
          title="Travel as You Wish"
        />

        {/* Page-opening prose. Composed from the shared primitives rather than
            given its own component — it is one page's introduction, not a
            pattern that repeats. */}
        <Section tone="sand">
          <SectionHeading
            eyebrow="Explore Bali"
            title="You are in the Right Hands . . ."
          />
          <Reveal delay={80}>
            <div className="mt-8 flex max-w-[62rem] flex-col gap-4">
              <p className="text-[17px] leading-[1.7] font-light text-text">
                Nyuh Bali was built with a great passion to serve, just like our
                motto to serve with a smile and sincerity. We welcome you first
                as a guest, hoping to make your stay as a friend, and in the
                end, leave us as family. We are committed to providing you with
                a flawless experience while exploring Bali. You are always
                welcome to choose your preferred destination. Our tour
                specialist will recommend an ideal itinerary according to the
                distance, time, and traffic based on years of experience.
              </p>
              <p className="text-[17px] leading-[1.7] font-light text-text">
                A family is a family because of loyalty and trust, that’s why
                Nyuh Bali’s team will never suggest you go shopping and get a
                commission behind it. The price for day travel already includes
                petrol, a parking fee, and refreshment.
              </p>
              <p className="text-[17px] leading-[1.7] font-light text-text">
                Guarantee of Peace : In the case, you found suspicious activity,
                please report it immediately to{" "}
                {/* The live page prints a `preview.` staging address here; the
                    property's real reservations inbox is used instead, the same
                    normalisation the footer and contact pages already apply. */}
                <a
                  href={`mailto:${site.contact.email}`}
                  className="text-primary-deep underline decoration-primary/40 underline-offset-[5px] transition-colors duration-300 hover:decoration-primary"
                >
                  {site.contact.email}
                </a>{" "}
                and we will change twice as much as the commission.
              </p>
              <p className="text-[17px] leading-[1.7] font-light text-text">
                We hope to set your mind at peace &amp; travel with us with
                confidence.
              </p>
            </div>
          </Reveal>
        </Section>

        <PackageList
          heading="Day Travelling"
          packages={DAY_TRAVELLING}
          tone="sand-deep"
        />

        <PackageList heading="Tour Packages" packages={TOURS} tone="sand" />

        {/* `scroll-mt` clears the 68/72px sticky header, so an anchored jump
            doesn't land the heading underneath it. */}
        <Section
          tone="sand-deep"
          width="narrow"
          className="scroll-mt-[68px] lg:scroll-mt-[72px]"
          id="tour-booking"
        >
          <InquiryForm
            heading="Book your Tour"
            fields={TOUR_FIELDS}
            submitLabel="Send"
          />
        </Section>

        <AwardsRow variant={site.awards.variant} badges={site.awards.badges} />
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
