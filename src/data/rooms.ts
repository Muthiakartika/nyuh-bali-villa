// Room and villa detail content, scraped from the ten WordPress detail pages
// that share one Oxygen template (see the Route Information comment in
// src/app/ubud/villa/[room]/page.tsx). Kept as data rather than ten near-identical
// page files: the pages differ only in these fields.
//
// GENERATED from the live site, then reviewed by hand. Files that consume this:
//   src/app/ubud/villa/[room]/page.tsx
//   src/app/seminyak/villa/[room]/page.tsx
//   src/components/property/RoomDetail.tsx

const U = "https://nyuhbalivillas.com/wp-content/uploads/";

export type RoomDetail = {
  /** URL segment(s) under /<property>/villa/ */
  slug: string;
  property: "seminyak" | "ubud";
  title: string;
  description: string;
  /** Label/value pairs from the live "Details" block. */
  details: { label: string; value: string }[];
  amenities: string[];
  facilities: string[];
  gallery: string[];
  hero: string;
};

export const ROOM_DETAILS: RoomDetail[] = [
  {
    slug: "suite",
    property: "ubud",
    title: "Suite",
    description:
      "Adapting the ideas of privacy, one floor only consists of three suites to ensure you enjoy the serenity and calmness you are looking for. Get ready to unwind in an ample bedroom space with a spacious bathroom including a stone bathtub, rain shower, and toilet area separately.",
    details: [
      { label: "View", value: "Tropical garden and Pool" },
      { label: "Size", value: "65 sqm" },
      { label: "Bedding Configuration", value: "1 King Size (1,8m x 2m) or 2 Hollywood twins (1,2m x 2m each)" },
      { label: "Bathroom", value: "Ensuite bathroom with bathtub, his & her sink, toilet, and shower" },
      { label: "Max Occupancy", value: "2 adults and one child (under five years old)" },
    ],
    amenities: ["Air Conditioned", "Minibar (additional charge)", "Safety box", "Toilet", "Coffeemaker", "Hair dryer", "Refrigerator", "Sitting Area", "Cold and hot running water", "Gazebo", "LCD TV with satellite channels", "Telephone"],
    facilities: ["Lobby with waiting area", "Onsite car park", "Home gym", "Retreat Facilities", "16 Hours Room Service", "Bale Lotus (picnic area)", "Guest concierge", "Two Main Pool", "Free Yoga Class", "Two Yoga Venue", "Wedding Venue", "24 hours reception & security", "Mahamaya SPA & Salon", "Free Daily Activity", "Restaurant", "Laundry Service"],
    gallery: [
      `${U}2023/03/Suite-1.webp`,
      `${U}2023/03/Suite-2.webp`,
      `${U}2023/03/Suite-3.webp`,
      `${U}2023/03/Suite-4.webp`,
      `${U}2023/03/Suite-5.webp`,
      `${U}2023/03/Suite-6.webp`,
    ],
    hero: `${U}2023/03/Suite-6.webp`,
  },
  {
    slug: "honeymoon/pool",
    property: "ubud",
    title: "Honeymoon Suite",
    description:
      "The honeymoon suite is overlooking the resort’s main pool and tropical garden. Feel the tropical vibes even more by enjoying the beautiful greenery from your balcony. Designed to enhance the romantic ambiance, our romantic setup, and signature flower bath will welcome you to start your romantic getaway.",
    details: [
      { label: "View", value: "Tropical garden and Pool" },
      { label: "Size", value: "65 sqm" },
      { label: "Bedding Configuration", value: "King Size (1,8m x 2m)" },
      { label: "Bathroom", value: "Ensuite bathroom with bathtub, his & her sink, toilet, and outdoor shower" },
      { label: "Max Occupancy", value: "2 adults and one child (under five years old)" },
    ],
    amenities: ["Air Conditioned", "Minibar (additional charge)", "Safety box", "Toilet", "Coffeemaker", "Hair dryer", "Refrigerator", "Sitting Area", "Cold and hot running water", "Gazebo", "LCD TV with satellite channels", "Telephone"],
    facilities: ["Lobby with waiting area", "Onsite car park", "Home gym", "Retreat Facilities", "16 Hours Room Service", "Bale Lotus (picnic area)", "Guest concierge", "Two Main Pool", "Free Yoga Class", "Two Yoga Venue", "Wedding Venue", "24 hours reception & security", "Mahamaya SPA & Salon", "Free Daily Activity", "Restaurant", "Laundry Service"],
    gallery: [
      `${U}2023/03/Honeymoon-Suite-1.webp`,
      `${U}2023/03/Honeymoon-Suite-2.webp`,
      `${U}2023/03/Honeymoon-Suite-3.webp`,
      `${U}2023/03/Honeymoon-Suite-4.webp`,
      `${U}2023/03/Honeymoon-Suite-5.webp`,
      `${U}2023/03/Honeymoon-Suite-6.webp`,
    ],
    hero: `${U}2023/03/Honeymoon-Suite-5.webp`,
  },
  {
    slug: "1-bedroom-pool-deluxe",
    property: "ubud",
    title: "One Bedroom Deluxe Pool Villa",
    description:
      "The 240 sqm pool villa comes with a private pool surrounded by greenery, a unique outdoor shower, an indoor bathtub made from natural green stone, and a semi-outdoor toilet. The warm earth tones of teak furniture complement the surroundings, creating a feeling of relaxation and a sense of being",
    details: [
      { label: "View", value: "Tropical garden and Pool" },
      { label: "Size", value: "240 sqm" },
      { label: "Bedding Configuration", value: "King Size (1,8m x 2m)" },
      { label: "Bathroom", value: "Ensuite bathroom with bathtub, his & her sink, toilet, and outdoor shower" },
      { label: "Pool Size", value: "3.5 m x 8 m" },
      { label: "Max Occupancy", value: "2 adults and one child (under five years old)" },
    ],
    amenities: ["Air Conditioned in the villa", "Dining area", "Minibar", "Pool chairs", "Telephone", "Coffeemaker", "Hair dryer", "Refrigerator", "Safety box", "Toilet", "Cold and hot running water", "LCD TV with satellite channels", "Pantry", "Sitting Area"],
    facilities: ["Lobby with waiting area", "Onsite car park", "Home gym", "Retreat Facilities", "16 Hours Room Service", "Bale Lotus (picnic area)", "Guest concierge", "Two Main Pool", "Free Yoga", "Two Yoga Venue", "Wedding Venue", "24 hours reception & security", "Mahamaya SPA & Salon", "Free Daily Activity", "Restaurant", "Laundry Service"],
    gallery: [
      `${U}2023/03/ubud-One-Bedroom-Deluxe-Pool-Villa.webp`,
      `${U}2023/03/ubud-One-Bedroom-Deluxe-Pool-Villa-6.webp`,
      `${U}2023/03/ubud-One-Bedroom-Deluxe-Pool-Villa-5.webp`,
      `${U}2023/03/ubud-One-Bedroom-Deluxe-Pool-Villa-4.webp`,
      `${U}2023/03/ubud-One-Bedroom-Deluxe-Pool-Villa-2.webp`,
      `${U}2023/03/ubud-One-Bedroom-Deluxe-Pool-Villa-2-1.webp`,
    ],
    hero: `${U}2023/03/ubud-One-Bedroom-Deluxe-Pool-Villa-6.webp`,
  },
  {
    slug: "1-bedroom-pool-royal",
    property: "ubud",
    title: "One Bedroom Royal Pool Villa",
    description:
      "Our Royal Villa offers a semi-open bathtub concept overlooking the private pool, which has become everyone’s favorite to relax and unwind. The royal villa comes with more spacious space (250 sqm) and also features a unique outdoor shower & semi-outdoor toilet.",
    details: [
      { label: "View", value: "Tropical garden and Pool" },
      { label: "Size", value: "250 sqm" },
      { label: "Bedding Configuration", value: "1 King Size (1,8m x 2m) or 2 Hollywood twins (1,2m x 2m each)" },
      { label: "Bathroom", value: "Ensuite bathroom with open-air natural stone bathtub, toilet, and outdoor shower" },
      { label: "Pool Size", value: "3.5 m x 8 m" },
      { label: "Max Occupancy", value: "2 adults and one child (under five years old)" },
    ],
    amenities: ["Air Conditioned in the villa", "Dining area", "Minibar", "Pool chairs", "Telephone", "Coffeemaker", "Hair dryer", "Refrigerator", "Safety box", "Toilet", "Cold and hot running water", "LCD TV with satellite channels", "Pantry", "Sitting Area"],
    facilities: ["Lobby with waiting area", "Onsite car park", "Home gym", "Retreat Facilities", "16 Hours Room Service", "Bale Lotus (picnic area)", "Guest concierge", "Two Main Pool", "Free Yoga", "Two Yoga Venue", "Wedding Venue", "24 hours reception & security", "Mahamaya SPA & Salon", "Free Daily Activity", "Restaurant", "Laundry Service"],
    gallery: [
      `${U}2023/03/One-Bedroom-Royal-Pool-Villa-6.webp`,
      `${U}2023/03/One-Bedroom-Royal-Pool-Villa-5.webp`,
      `${U}2023/03/One-Bedroom-Royal-Pool-Villa-4.webp`,
      `${U}2023/03/One-Bedroom-Royal-Pool-Villa-3.webp`,
      `${U}2023/03/One-Bedroom-Royal-Pool-Villa-2.webp`,
      `${U}2023/03/One-Bedroom-Royal-Pool-Villa-1.webp`,
    ],
    hero: `${U}2023/03/One-Bedroom-Royal-Pool-Villa-6.webp`,
  },
  {
    slug: "honeymoon",
    property: "ubud",
    title: "Honeymoon Pool Villa",
    description:
      "Knock on the gate and welcome yourself with our romantic setup and signature flower bath to begin your romantic journey with your loved one. Each spacious honeymoon villa (250 sqm) also includes an open-air jacuzzi to soak your stress away that could not be found in any other room.",
    details: [
      { label: "View", value: "Tropical garden and Pool" },
      { label: "Size", value: "250 sqm" },
      { label: "Bedding Configuration", value: "1 King Size (1,8m x 2m)" },
      { label: "Bathroom", value: "Ensuite bathroom with open-air natural stone bathtub, jacuzzi, outdoor toilet, and outdoor shower" },
      { label: "Pool Size", value: "3.5 m x 8 m" },
      { label: "Max Occupancy", value: "2 adults and one child (under five years old)" },
    ],
    amenities: ["Air Conditioned in the villa", "Dining area", "Minibar", "Pool chairs", "Telephone", "Coffeemaker", "Hair dryer", "Refrigerator", "Safety box", "Toilet", "Cold and hot running water", "LCD TV with satellite channels", "Pantry", "Sitting Area"],
    facilities: ["Lobby with waiting area", "Onsite car park", "Home gym", "Retreat Facilities", "16 Hours Room Service", "Bale Lotus (picnic area)", "Guest concierge", "Two Main Pool", "Free Yoga", "Two Yoga Venue", "Wedding Venue", "24 hours reception & security", "Mahamaya SPA & Salon", "Free Daily Activity", "Restaurant", "Laundry Service"],
    gallery: [
      `${U}2023/03/Honeymoon-Pool-Villa-5.webp`,
      `${U}2023/03/Honeymoon-Pool-Villa-4.webp`,
      `${U}2023/03/Honeymoon-Pool-Villa-3.webp`,
      `${U}2023/03/Honeymoon-Pool-Villa-2.webp`,
      `${U}2023/03/Honeymoon-Pool-Villa-1.webp`,
      `${U}2023/03/One-Bedroom-Royal-Pool-Villa-1.webp`,
    ],
    hero: `${U}2023/03/Honeymoon-Pool-Villa-5.webp`,
  },
  {
    slug: "2-bedroom-pool",
    property: "ubud",
    title: "Two Bedroom Pool Villa",
    description:
      "Like our other villas, our two-bedroom pool villa in Ubud offers a private swimming pool to relax and unwind. Each bedroom overlooks the tropical garden and pool, with full amenities, including an individual bathroom, expansive indoor bathtub, and outdoor shower designed to enhance comfort and privacy.",
    details: [
      { label: "View", value: "Tropical garden and Pool" },
      { label: "Size", value: "300 sqm" },
      { label: "Bedding Configuration", value: "Two King Size (1,8m x 2m) OR 1 King Size + 2 Holywood twins" },
      { label: "Bathroom", value: "Ensuite bathroom with indoor natural stone bathtub, toilet, and outdoor shower" },
      { label: "Pool Size", value: "4 m x 8 m" },
      { label: "Max Occupancy", value: "4 adults and two children (below five years old)" },
    ],
    amenities: ["Air Conditioned in the villa", "Dining area", "Minibar", "Pool chairs", "Telephone", "Coffeemaker", "Hair dryer", "Refrigerator", "Safety box", "Toilet", "Cold and hot running water", "LCD TV with satellite channels", "Pantry", "Sitting Area"],
    facilities: ["Lobby with waiting area", "Onsite car park", "Home gym", "Retreat Facilities", "16 Hours Room Service", "Bale Lotus (picnic area)", "Guest concierge", "Two Main Pool", "Free Yoga", "Two Yoga Venue", "Wedding Venue", "24 hours reception & security", "Mahamaya SPA & Salon", "Free Daily Activity", "Restaurant", "Laundry Service"],
    gallery: [
      `${U}2023/03/Two-Bedroom-Pool-Villa-1.webp`,
      `${U}2023/03/Two-Bedroom-Pool-Villa-hero.webp`,
      `${U}2023/03/Two-Bedroom-Pool-Villa-4.webp`,
      `${U}2023/03/Two-Bedroom-Pool-Villa-5.webp`,
      `${U}2023/03/One-Bedroom-Royal-Pool-Villa-1.webp`,
      `${U}2023/03/Two-Bedroom-Pool-Villa-6.webp`,
    ],
    hero: `${U}2023/03/Two-Bedroom-Pool-Villa-hero.webp`,
  },
  {
    slug: "3-bedroom-pool",
    property: "ubud",
    title: "Three Bedroom Pool Villa",
    description:
      "Welcome to our unique villa types that connect one-bedroom and two-bedroom pool villas. No surprise, you will be spoiled with two private pools surrounded by a lush tropical garden. The villa features three bedrooms, three bathrooms, and two stylish separate living and dining areas to enjoy balmy Balinese nights with your family or friends.",
    details: [
      { label: "View", value: "Tropical garden and Pool" },
      { label: "Size", value: "540 sqm" },
      { label: "Bedding Configuration", value: "2 King Size (1,8m x 2m) + 2 Twins" },
      { label: "Bathroom", value: "Ensuite bathroom with indoor bathtub, toilet, and outdoor shower" },
      { label: "Pool Size", value: "3,5m x 8m and 4m x 8m" },
      { label: "Max Occupancy", value: "6 adults and two children (under five years old)" },
    ],
    amenities: ["Air Conditioned in the villa", "Dining area", "Minibar", "Pool chairs", "Telephone", "Coffeemaker", "Hair dryer", "Refrigerator", "Safety box", "Toilet", "Cold and hot running water", "LCD TV with satellite channels", "Pantry", "Sitting Area"],
    facilities: ["Lobby with waiting area", "Onsite car park", "Home gym", "Retreat Facilities", "16 Hours Room Service", "Bale Lotus (picnic area)", "Guest concierge", "Two Main Pool", "Free Yoga", "Two Yoga Venue", "Wedding Venue", "24 hours reception & security", "Mahamaya SPA & Salon", "Free Daily Activity", "Restaurant", "Laundry Service"],
    gallery: [
      `${U}2023/03/Three-Bedroom-Pool-Villa-4.webp`,
      `${U}2023/03/Two-Bedroom-Pool-Villa-6.webp`,
      `${U}2023/03/Three-Bedroom-Pool-Villa-1.webp`,
      `${U}2023/03/One-Bedroom-Royal-Pool-Villa-1.webp`,
      `${U}2023/03/Three-Bedroom-Pool-Villa-2.webp`,
      `${U}2023/03/Three-Bedroom-Pool-Villa-5.webp`,
    ],
    hero: `${U}2023/03/Three-Bedroom-Pool-Villa-4.webp`,
  },
  {
    slug: "4-bedroom-pool",
    property: "ubud",
    title: "Four-Bedroom Pool Villa",
    description:
      "We all agree that the vacation lasts much longer than the trip. Limited to just one unit, our four-bedroom pool villa in Ubud (450 sqm) is designed to strengthen your bond with your family or best friends. Wake up to tropical greenery views, dip and laugh together in our emerald stone natural pool, and savor your taste bud with Balinese BBQ style in your own private villa.",
    details: [
      { label: "View", value: "Tropical garden and Pool" },
      { label: "Size", value: "450 sqm" },
      { label: "Bedding Configuration", value: "3 King Size (1,8m x 2m) + 2 Holywood twins" },
      { label: "Bathroom", value: "Ensuite bathroom with open-air natural stone bathtub, outdoor toilet, and outdoor shower" },
      { label: "Pool Size", value: "4,5m x 10m" },
      { label: "Max Occupancy", value: "8 adults and two children (under five years old)" },
    ],
    amenities: ["Air Conditioned in the villa", "Dining area", "Minibar", "Pool chairs", "Telephone", "Coffeemaker", "Hair dryer", "Refrigerator", "Safety box", "Toilet", "Cold and hot running water", "LCD TV with satellite channels", "Pantry", "Sitting Area"],
    facilities: ["Lobby with waiting area", "Onsite car park", "Home gym", "Retreat Facilities", "16 Hours Room Service", "Bale Lotus (picnic area)", "Guest concierge", "Two Main Pool", "Free Yoga", "Two Yoga Venue", "Wedding Venue", "24 hours reception & security", "Mahamaya SPA & Salon", "Free Daily Activity", "Restaurant", "Laundry Service"],
    gallery: [
      `${U}2023/03/Four-Bedroom-Pool-Villa-1.webp`,
      `${U}2023/03/Four-Bedroom-Pool-Villa-2.webp`,
      `${U}2023/03/Four-Bedroom-Pool-Villa-3.webp`,
      `${U}2023/03/Four-Bedroom-Pool-Villa-5.webp`,
      `${U}2023/03/Four-Bedroom-Pool-Villa-4.webp`,
      `${U}2023/03/One-Bedroom-Royal-Pool-Villa-1.webp`,
    ],
    hero: `${U}2023/03/Four-Bedroom-Pool-Villa-4.webp`,
  },
  {
    slug: "honeymoon",
    property: "seminyak",
    title: "Honeymoon Suite Pool Villa",
    description:
      "Set across some 150 square meters, our honeymoon villa in Seminyak will give ultimate comfort as equipped with an outdoor gazebo for relaxing in the poolside. Start the beginning journey as Mr and Mrs with the stay that you both will treasure in a lifetime. Give a little surprise to your love with our signature honeymoon set up upon arrival that consists of bed decoration, honeymoon cake, and handcrafted flower bath just for you",
    details: [
      { label: "View", value: "Tropical garden and Pool" },
      { label: "Size", value: "150 sqm" },
      { label: "Bedding Configuration", value: "King Size (1,8m x 2m)" },
      { label: "Bathroom", value: "Ensuite bathroom with bathtub, his & her sink, toilet, and outdoor shower" },
      { label: "Pool Size", value: "3 m x 7 m" },
      { label: "Max Occupancy", value: "2 adults and one child (under five years old)" },
    ],
    amenities: ["Air Conditioned in the villa", "Dining area", "Minibar (additional charge)", "Safety box", "Toilet", "Coffeemaker", "Hair dryer", "Refrigerator", "Sitting Area", "Exclusive Amenities by Sensatia Botanical", "Cold and hot running water", "Gazebo", "LCD TV with satellite channels", "Pool chairs", "Telephone"],
    facilities: ["Lobby with waiting area", "Onsite restaurant", "Guest concierge", "24 hours reception & security", "Laundry service and dry cleaning", "15 hours room service", "Onsite day spa", "Onsite car park", "Complimentary Wi-Fi"],
    gallery: [
      `${U}2023/03/Honeymoon-Suite-Pool-Villa-1.webp`,
      `${U}2023/03/Honeymoon-Suite-Pool-Villa-2.webp`,
      `${U}2023/03/Honeymoon-Suite-Pool-Villa-5.webp`,
      `${U}2023/03/Honeymoon-Suite-Pool-Villa-6.webp`,
      `${U}2023/03/Honeymoon-Suite-Pool-Villa-3.webp`,
      `${U}2023/03/Honeymoon-Suite-Pool-Villa-4.webp`,
    ],
    hero: `${U}2023/03/Honeymoon-Suite-Pool-Villa-1.webp`,
  },
  {
    slug: "honeymoon/pool",
    property: "seminyak",
    title: "One Bedroom Pool Villa",
    description:
      "Equally set on the area of some 120 square meters of land, this villa offer the huge private pool, ensuite bathroom, and bedroom. Enjoy the intimate moment with your love in your own private pool.",
    details: [
      { label: "View", value: "Tropical garden and Pool" },
      { label: "Size", value: "120 sqm" },
      { label: "Bedding Configuration", value: "King Size (1,8m x 2m)" },
      { label: "Bathroom", value: "Ensuite bathroom with bathtub, his & her sink, toilet, and outdoor shower" },
      { label: "Pool Size", value: "3 m x 7 m" },
      { label: "Max Occupancy", value: "2 adults and one child (under five years old)" },
    ],
    amenities: ["Air Conditioned in the villa", "Dining area", "Minibar (additional charge)", "Safety box", "Toilet", "Coffeemaker", "Hair dryer", "Refrigerator", "Sitting Area", "Exclusive Amenities by Sensatia Botanical", "Cold and hot running water", "LCD TV with satellite channels", "Pool chairs", "Telephone"],
    facilities: ["Lobby with waiting area", "Onsite restaurant", "Guest concierge", "24 hours reception & security", "Laundry service and dry cleaning", "15 hours room service", "Onsite day spa", "Onsite car park", "Complimentary Wi-Fi"],
    gallery: [
      `${U}2023/03/One-Bedroom-Pool-Villa-2.webp`,
      `${U}2023/03/seminyak-best-price.webp`,
      `${U}2023/03/One-Bedroom-Pool-Villa-5.webp`,
      `${U}2023/03/One-Bedroom-Pool-Villa-1.webp`,
      `${U}2023/03/One-Bedroom-Pool-Villa-4.webp`,
      `${U}2023/03/One-Bedroom-Pool-Villa-3.webp`,
    ],
    hero: `${U}2023/03/One-Bedroom-Pool-Villa-2.webp`,
  },
];
