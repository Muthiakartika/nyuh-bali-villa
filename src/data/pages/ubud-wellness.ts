// Content for src/app/ubud/wellness/page.tsx.
//
// It lives here rather than in the route for one reason: the Sanity migration
// seeds this page's `page` document from these exact constants, and a module
// that imports React or `server-only` cannot be read by a plain Node script.
// One copy, so the CMS cannot drift from the page it was seeded from.

import type { PackageItem } from "@/components/property/PackageList";
import type { Testimonial } from "@/data/testimonials";

export const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads";

export const WELLNESS_BASE = "/ubud/wellness";

// The hero deliberately does NOT reuse the yoga photograph below it. The live
// site opens this page on the same picture the Yoga Class row carries, and the
// client asked for no repeated image on a page — the yoga photo is the one the
// class row needs, so the header takes a different wellness scene instead.
export const HERO_IMAGES = [`${UPLOADS}/2023/04/image-6.png`];

export const FACILITIES: PackageItem[] = [
  {
    name: "Yoga Class",
    // The live site's own yoga photograph, kept here at the client's request.
    // It used to be the page hero as well; the hero now carries a different
    // picture so this one appears exactly once.
    images: [`${UPLOADS}/2024/11/IMG_9148-Edit-min-1.jpg`],
    description:
      "Gift yourself a relaxing yoga flow that will re-energize and wake up your entire body. Our yoga class is designed to be suitable for everyone from beginners to intermediate, no matter your fitness level. You will be guided step by step with our certified yoga teacher to do yoga pose in the correct alignment. And not only that, we also will help you to create a deeper connection between the breath and the movement. Available daily as complimentary exclusively for our in-house guests.",
    ctas: [
      { label: "Explore More", href: `${WELLNESS_BASE}/yoga`, inScope: true },
    ],
  },
  {
    name: "Free Access to Our Home Gym",
    images: [`${UPLOADS}/2026/08/Nyuh-Bali-Ubud-23-1.jpg`],
    description:
      "Opening Hours: 7.00 AM – 9.00 PM. Here at Nyuh Bali, we understand your regular workout cannot be put on standby just because you are away from home. We have created a home gym to keep you in shape during the holiday. Exclusively for our in-house guests.",
    ctas: [{ label: "Explore More", href: "/ubud/fitness" }],
  },
  {
    name: "Sound Healing",
    images: [`${UPLOADS}/2023/05/AW_06640-min-Copy.jpg`],
    description:
      "Learn to let go is the key of happiness; - Buddha. Join our sound healing session to relax your mind and appreciate the present moment to achieve mental peace and tranquillity. Our healing practitioner uses different sound vibrations to help unblock the unexpressed emotion and let go of the negative energy. Available every Thursday, Saturday, and Sunday as complimentary exclusively for our in-house guests.",
    ctas: [
      {
        label: "Explore More",
        href: `${WELLNESS_BASE}/sound-healing`,
        inScope: true,
      },
    ],
  },
  {
    name: "Breathwork",
    images: [`${UPLOADS}/2023/05/TD004090-min-Copy.jpg`],
    description:
      "How we breathe describes how we live. Breathwork exercise using various breathing techniques to relieve anxiety and reduce stress in your body. It also provides an opportunity for stored negative emotions to surface and be released as we exhale. It is also known as a more accessible alternative of meditation to achieve inner peace and better life quality. Available every Tueday & Friday as complimentary exclusively for our in-house guests.",
    ctas: [
      {
        label: "Explore More",
        href: `${WELLNESS_BASE}/breathwork`,
        inScope: true,
      },
    ],
  },
  {
    name: "BodyTone Flow",
    images: [`${UPLOADS}/2023/05/Lina-instructor-min.webp`],
    description:
      "Experience an energizing workout that targets your entire body using your own body weight as the primary resistance. These flowing exercises are ideal for everyone, regardless of fitness level. This practice helps enhance core strength, tone your body, and boost your confidence.",
    ctas: [
      {
        label: "Explore More",
        href: `${WELLNESS_BASE}/body-tone-flow`,
        inScope: true,
      },
    ],
  },
  {
    name: "Life Coach with Psychologist",
    images: [`${UPLOADS}/2023/05/IS_06578-min.webp`],
    description:
      "Our certified psychologist will guide you through the intimate session to detach from what does not serve you anymore and live more mindfully afterward. To respect your privacy, the session will be held in your villa or room balcony or any place in our resort that your soul is comfortable with.",
    ctas: [
      {
        label: "Explore More",
        href: `${WELLNESS_BASE}/life-coach`,
        inScope: true,
      },
    ],
  },
  {
    name: "Reiki Healing",
    images: [`${UPLOADS}/2023/05/IS_06972-min.webp`],
    description:
      "Reiki is made of two Japanese words – Rei, which means universal spirit or the higher power, and Ki which means life force energy. This “Universal Life Force Energy” applies to all regardless of belief system, religion, race, and gender. Energy in reiki will bring you to a mediation state automatically and reach a point of stillness to feel deeply nurtured. It also promotes energy supply to our body to start healing itself.",
    ctas: [
      {
        label: "Explore More",
        href: `${WELLNESS_BASE}/reiki-healing`,
        inScope: true,
      },
    ],
  },
  {
    name: "Holistic Chakra Balancing",
    images: [
      `${UPLOADS}/2023/03/54A5D787-D98B-4026-9F30-97102505361F-min-1.webp`,
    ],
    description:
      "The human body is believed to have seven Chakras, and each of them has a specific function to keep a balanced life. If one chakra is blocked, it will cause physical and mental imbalances leading to anxiety, overthinking, or even sadness. The healing session helps to release the negative energy and remove blocks to clarity, calm, and self-love for a well-balanced life.",
    ctas: [
      {
        label: "Explore More",
        href: `${WELLNESS_BASE}/chakra-healing`,
        inScope: true,
      },
    ],
  },
];

export const GUEST_QUOTES: Testimonial[] = [
  {
    quote:
      "The spa treatment is so relaxing and pampering. It also includes a flower bath that we can customize (perfect for the Instagram shots). Thank you Mahamaya Spa. I will definitely come back whenever I visit Bali again",
    author: "Stephanie, Google",
  },
  {
    quote:
      "We loved the daily yoga classes with Pabi, who was very sweet and an excellent instructor. Our foot massage and couples massage were both perfect and so relaxing",
    author: "Nicole Himes, Tripadvisor",
  },
  {
    quote:
      "The morning yoga classes gave the soul of Bali a real feeling! We rested very much in this place and we recommend it with all our heart!",
    author: "Dominika Wronowska, Tripadvisor",
  },
  {
    quote:
      "I had a hot stone massage at the spa and it was really lovely. So tranquil and relaxing. Its also next to a river which gives you beautiful sounds as natural background music!",
    author: "Carina, Google",
  },
  {
    quote:
      "We loved the yoga classes with Paby. She is a great yoga professional. We are from Spain and we have gone to some yoga classes that we did not like but the yoga classes with Paby have been great",
    author: "Paloma Fernández, Google",
  },
];
