// Content for src/app/seminyak/tour/page.tsx.
//
// It lives here rather than in the route for one reason: the Sanity migration
// seeds this page's `page` document from these exact constants, and a module
// that imports React or `server-only` cannot be read by a plain Node script.
// One copy, so the CMS cannot drift from the page it was seeded from.

import type { PackageItem } from "@/components/property/PackageList";
import type { InquiryField } from "@/components/property/InquiryForm";

export const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads";

// Every tour's "Book Now" points here — the live page's buttons have no
// destination at all (href="http://"); the form below is what actually takes a
// tour booking, so linking to it is the honest reading of that intent.
export const BOOKING_ANCHOR = "#tour-booking";

// Photographs verified against this route on the live site, 2026-09-04 — with
// the header as the deliberate exception: the live one is the resort-car photo
// the Half Day charter below carries, and no picture may appear twice on a
// page, so the header opens on a Seminyak sunset instead.
export const HERO_IMAGES = [
  `${UPLOADS}/2024/10/Sunset-Seminyak-1-Source_-Stephan-Despins.jpg`,
];

// The two open-ended charters. They have no photographs of their own on the
// live page, which used the page header image for both; here they take one
// scene each so no two rows on the page carry the same picture.
export const DAY_TRAVELLING: PackageItem[] = [
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
    images: [`${UPLOADS}/2023/06/Campuhan-ridge-walk.webp`],
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
export const TOURS: PackageItem[] = [
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
    // Taman Ayun and Tanah Lot are on this itinerary too, but they are the
    // Exotic Sunset Tour's only two stops and carry its slider — showing them
    // twice on one page made the two tours look like the same trip. This
    // slider takes the stops that are unique to it; the itinerary line below
    // still lists all four.
    images: [
      `${UPLOADS}/2023/03/jatiluwih.webp`,
      `${UPLOADS}/2023/03/ulun-danu-1.webp`,
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
export const TOUR_PROSE = [
  "Nyuh Bali was built with a great passion to serve, just like our motto to serve with a smile and sincerity. We welcome you first as a guest, hoping to make your stay as a friend, and in the end, leave us as family. We are committed to providing you with a flawless experience while exploring Bali. You are always welcome to choose your preferred destination. Our tour specialist will recommend an ideal itinerary according to the distance, time, and traffic based on years of experience.",
  "A family is a family because of loyalty and trust, that’s why Nyuh Bali’s team will never suggest you go shopping and get a commission behind it. The price for day travel already includes petrol, a parking fee, and refreshment.",
  // The live page prints a `preview.` staging address in this line; the
  // property's real reservations inbox is substituted for `{email}`, the same
  // normalisation the footer and contact pages already apply.
  "Guarantee of Peace : In the case, you found suspicious activity, please report it immediately to {email} and we will change twice as much as the commission.",
  "We hope to set your mind at peace & travel with us with confidence.",
];

export const TOUR_FIELDS: InquiryField[] = [
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
