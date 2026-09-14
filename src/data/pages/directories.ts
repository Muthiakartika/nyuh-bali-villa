// Content for the four pages WordPress publishes outside the site's
// navigation:
//
//   src/app/seminyak-directory/page.tsx
//   src/app/ubud-directory/page.tsx
//   src/app/suite-directory/page.tsx
//   src/app/welcomeaboard/page.tsx
//
// It lives here rather than in the routes for the reason every other file in
// this folder does: the Sanity migration seeds a page's `page` document from
// these exact constants, and a module that imports React or `server-only`
// cannot be read by a plain Node script. One copy, so the CMS cannot drift
// from the page it was seeded from.
//
// **These four are reached from a QR code in the room, not from search.** A
// guest scans the code by the bed and lands on a hub of menus; nothing on the
// site links to any of them, and the live sitemap lists none of them either,
// which is why `src/app/sitemap.ts` leaves them out. They are built because
// the QR codes already printed on cards in every room point at these URLs —
// this build replacing the live site must not turn those into 404s.
//
// Scraped from the live pages (Oxygen Builder, so the REST API returns an
// empty body and the copy has to come from the rendered HTML). Every heading,
// paragraph, button label, emphasis and file link below is the live page's
// own; verified by diffing the live pages' visible text against the rendered
// routes, which came back identical apart from the footer our own
// PropertyFooter draws.
//
// **The PDFs are served by this site.** Every menu links to a file in
// public/uploads/, downloaded from WordPress along with all 315 photographs —
// see the note in next.config.ts. They were hotlinked at first, which would
// have left a guest scanning the QR code by their bed staring at a dead
// breakfast menu the day WordPress was switched off.

import type {
  PackageItem,
  PackageRun,
} from "@/components/property/PackageList";

export const UPLOADS = "/uploads";

export type DirectoryPageContent = {
  /** The live page opens on this, and it is the page's only heading — so it
   * is rendered as the `<h1>`, via PackageList's `headingAs`. */
  heading: string;
  /** Runs rather than a string only where the source bolds something. */
  intro: string | PackageRun[];
  /** Each of the live page's alternating image/text blocks, which are the
   * same shape PackageList already renders on five other routes: one
   * photograph, a paragraph, and a row of link buttons. */
  items: PackageItem[];
};

/** Nyuh Bali Villas Seminyak — the villa's in-room directory. */
export const SEMINYAK_DIRECTORY: DirectoryPageContent = {
  heading: "Welcome Home",
  intro:
    "Thank you for choosing us, Nyuh Bali Villas, as your romantic getaway. It would be an honor to be a part of your love story. We are committed to serving you personally and ready to attend to your most pressing requests because you matters",
  items: [
    {
      name: "Enhance your Stay",
      images: [`${UPLOADS}/2022/12/Enhance-your-stay.jpeg`],
      description:
        "Let us help you to make your stay comfortable. Discover our thoughtful perks to help enhance your stay. We could also arrange a personalized romantic arrangement such as a birthday treat, anniversary gift, or even a little surprise for her. Please let us know your preference, and we will explore all possibilities.",
      ctas: [
        {
          label: "Spa Menu 15% Off",
          href: "/uploads/2023/03/Spa-Menu-Seminyak-2.pdf",
          external: true,
        },
        {
          label: "Enhance your Stay",
          href: "/uploads/2024/03/Enhance-your-stay-seminyak.pdf",
          external: true,
        },
        {
          label: "Tour Menu",
          href: "/uploads/2023/03/Tour-Menu-030123.pdf",
          external: true,
        },
      ],
    },
    {
      name: "Dining Experience",
      images: [`${UPLOADS}/2022/12/Dining-experience.jpeg`],
      description:
        "Enjoy tasty foods with personalized service at our Nyuh Restaurant or a private dining experience in your own villa. As one of our preventive measures, our Restaurant opens with a 50% seating capacity",
      ctas: [
        {
          label: "Candle Light Dinner & BBQ",
          href: "/uploads/2023/12/CLD-BBQ-Menu-Seminyak.pdf",
          external: true,
        },
        {
          label: "Ala Carte Menu",
          href: "/uploads/2025/03/Seminyak-Ala-carte-Menu.pdf",
          external: true,
        },
        {
          label: "Breakfast Menu",
          href: "/uploads/2023/12/Breakfast-Menu-Seminyak.pdf",
          external: true,
        },
        {
          label: "Package Menu",
          href: "/uploads/2023/03/Set-Menu-Seminyak-300422.pdf",
          external: true,
        },
      ],
    },
    {
      name: "Useful Information",
      images: [`${UPLOADS}/2022/12/Useful-information.jpeg`],
      description:
        "Please find the information about our facilities and services in detail. Should you need any assistance, simply call 0 from your room or +6282289892227 if you are outside of the villa. Our team is available for 24 hours to assist you",
      ctas: [
        {
          label: "Room Directory",
          href: "/uploads/2023/03/Room-Directory-1.pdf",
          external: true,
        },
        {
          label: "Minibar List",
          href: "/uploads/2023/03/Minibar-list-seminyak.jpg",
          external: true,
        },
        {
          label: "WhatsApp",
          href: "https://api.whatsapp.com/send?phone=6282289892227",
          external: true,
          variant: "outline",
        },
      ],
    },
  ],
};

/** Ubud Nyuh Bali Resort — the villa guests' in-room directory. */
export const UBUD_DIRECTORY: DirectoryPageContent = {
  heading: "Welcome Home",
  intro:
    "Thank you for choosing us, Ubud Nyuh Bali Resort, as your luxury retreat. We aim to provide you with the goodness of Balinese healing and scientific-based medicine to rejuvenate both inside and outside. We hope you will find peace of mind during your stay and feel reborn afterward.",
  items: [
    {
      name: "Healthy Look Aesthetic",
      images: [`${UPLOADS}/2024/07/WFM04209-min-min.jpg`],
      description:
        "If you are thinking about coming home with a fresher look, then look no further. We offer world-class aesthetic treatments like Botox, Medi Facial, Profhilo, PRP, Dermal Filler, and Slimming Technology in a caring environment to help you look and feel your best. Enjoy 10% discount for medi facial and CE certified muscle sculpting treatment.",
      ctas: [
        {
          label: "Aesthetic Treatments",
          href: "https://healthylook-aesthetic.com/treatment/",
          external: true,
        },
        {
          label: "Facial Menu",
          href: "https://healthylook-aesthetic.com/medi-facial-ubud-bali/",
          external: true,
        },
        {
          label: "Price List",
          href: "https://healthylook-aesthetic.com/pricing/",
          external: true,
        },
        {
          label: "Book your Appointment",
          href: "https://api.whatsapp.com/send?phone=6282221009191&text=Hi%20Healthy%20Look%20Aesthetic%2C",
          external: true,
        },
      ],
    },
    {
      name: "Relax & Indulge",
      images: [`${UPLOADS}/2022/12/Ubud-relax-and-indulge.jpeg`],
      description: [
        {
          text: "Start your day with a gentle yoga sequence to help you live in the present moment. Enjoy complimentary ",
        },
        { text: "morning yoga class", bold: true },
        {
          text: " from 08.30 - 09.30 AM. Join our afternoon wellness activities like ",
        },
        { text: "pilates ", bold: true },
        { text: "to keep active during holiday, or " },
        { text: "sound healing", bold: true },
        { text: ", and " },
        { text: "breathwork ", bold: true },
        {
          text: "to let go things that no longer serve you. Indulge yourself even more at our ",
        },
        { text: "Mahamaya SPA", bold: true },
        {
          text: " with a collection of delightful spa treatments that will pamper your body and soul.",
        },
      ],
      ctas: [
        {
          label: "Spa Menu",
          href: "/uploads/2024/12/Spa-Menu-Villa.pdf",
          external: true,
        },
        {
          label: "Wellness Menu",
          href: "/uploads/2025/01/Wellness-Menu-Villa.pdf",
          external: true,
        },
        {
          label: "Resort Activities",
          href: "/uploads/2025/07/Resort-Activities-1.pdf",
          external: true,
        },
        {
          label: "Book the Spa",
          href: "https://www.fresha.com/book-now/mahamaya-spa-at-ubud-nyuh-bali-resort-ey5svh4w/all-offer?pId=1163981",
          external: true,
        },
      ],
    },
    {
      name: "Enhance your Stay",
      images: [`${UPLOADS}/2022/12/Ubud-enhance-your-stay.jpeg`],
      description:
        "Let us help you to make your stay comfortable. Discover our thoughtful perks to help enhance your stay. We also could arrange a personalized romantic arrangement such as a birthday treat, anniversary gift, or even just a little surprise for her. Please let us know your preference, and we will explore all possibilities.",
      ctas: [
        {
          label: "Enhance your Stay",
          href: "/uploads/2025/06/Enhance-your-stay-Villa.pdf",
          external: true,
        },
      ],
    },
    {
      name: "Dining Experience",
      images: [`${UPLOADS}/2023/03/ubud-dining-2.webp`],
      description: [
        {
          text: "There are no substitutes for quality; our team is committed to serving the finest quality ingredients and freshest food every day. Enjoy ",
        },
        { text: "breakfast", bold: true },
        { text: " at our " },
        { text: "restaurant ", bold: true },
        { text: "and enjoy " },
        { text: "free-flow side dishes", bold: true },
        {
          text: " like seasonal salad bars, tropical fruits, cereal, juice, dim sum, and bread.",
        },
      ],
      ctas: [
        {
          label: "Private BBQ",
          href: "/uploads/2023/06/BBQ-Ubud-020623.pdf",
          external: true,
        },
        {
          label: "Candle Light Dinner",
          href: "/uploads/2023/11/CLD-Menu-Ubud.pdf",
          external: true,
        },
        {
          label: "All Day Menu",
          href: "/uploads/2025/10/Ala-Carte-Villa.pdf",
          external: true,
        },
        {
          label: "Breakfast",
          href: "/uploads/2024/08/Breakfast-Menu-Ubud-Nyuh-Bali-Resort.pdf",
          external: true,
        },
        {
          label: "Package Menu",
          href: "/uploads/2023/03/Set-Menu-Ubud.pdf",
          external: true,
        },
        {
          label: "Healthy Menu",
          href: "/uploads/2024/02/Earthy-Menu.pdf",
          external: true,
        },
      ],
    },
    {
      name: "Useful Information",
      images: [`${UPLOADS}/2022/12/Ubud-useful-information.jpeg`],
      description:
        "Please find the information about our facilities and services in detail. Should you need any assistance, simply call 0 from your room or +6281337866866 if you are outside of the resort. Our team is available for 24 hours to assist you.",
      ctas: [
        {
          label: "Resort Map",
          href: "/uploads/2026/03/Resort-map-Ubud-Nyuh-Bali.pdf",
          external: true,
        },
        {
          label: "Room Directory",
          href: "/uploads/2023/05/Room-directory-ubud-villa.pdf",
          external: true,
        },
        {
          label: "Minibar List",
          href: "/uploads/2023/03/Minibar-list-Ubud.png",
          external: true,
        },
        {
          label: "TV Remote Operation",
          href: "/uploads/2023/03/TV-Remote-Control-1.pdf",
          external: true,
        },
        {
          label: "Shuttle Schedule",
          href: "/uploads/2023/12/Shuttle-Schedule-Ubud-Nyuh-Bali-Resort.pdf",
          external: true,
        },
        {
          label: "WhatsApp",
          href: "https://api.whatsapp.com/send?phone=6281337866866",
          external: true,
          variant: "outline",
        },
      ],
    },
  ],
};

/**
 * Ubud Nyuh Bali Resort — the suite guests' in-room directory.
 *
 * Near-identical to UBUD_DIRECTORY and deliberately kept as its own copy
 * rather than shared: the suites differ in their photographs, their dining
 * room, the extension guests dial, and which menus apply. Folding the two
 * together would mean a conditional in every field for three shared
 * paragraphs.
 */
export const SUITE_DIRECTORY: DirectoryPageContent = {
  heading: "Welcome Home",
  intro:
    "Thank you for choosing us, Ubud Nyuh Bali Resort, as your luxury retreat. We aim to provide you with the goodness of Balinese healing and scientific-based medicine to rejuvenate both inside and outside. We hope you will find peace of mind during your stay and feel reborn afterward.",
  items: [
    {
      name: "Healthy Look Aesthetic",
      images: [`${UPLOADS}/2024/07/WFM04209-min-min.jpg`],
      description:
        "If you are thinking about coming home with a fresher look, then look no further. We offer world-class aesthetic treatments like Botox, Facial, Profhilo, PRP, Dermal Filler, and Slimming Technology in a caring environment to help you look and feel your best. Enjoy 10% discount for medi facial and CE certified muscle sculpting treatment.",
      ctas: [
        {
          label: "Aesthetic Treatments",
          href: "https://healthylook-aesthetic.com/treatment/",
          external: true,
        },
        {
          label: "Facial Menu",
          href: "https://healthylook-aesthetic.com/medi-facial-ubud-bali/",
          external: true,
        },
        {
          label: "Price List",
          href: "https://healthylook-aesthetic.com/pricing/",
          external: true,
        },
        {
          label: "Book your Appointment",
          href: "https://api.whatsapp.com/send?phone=6282221009191&text=Hi%20Healthy%20Look%20Aesthetic%2C",
          external: true,
        },
      ],
    },
    {
      name: "Relax & Indulge",
      images: [`${UPLOADS}/2023/05/Flower-bath-spa.webp`],
      description: [
        {
          text: "Start your day with a gentle yoga sequence to help you live in the present moment. Enjoy complimentary ",
        },
        { text: "morning yoga", bold: true },
        {
          text: " class from 08.30 - 09.30 AM. Join our afternoon wellness activities like ",
        },
        { text: "pilates ", bold: true },
        { text: "to keep active during holiday, or " },
        { text: "sound healing", bold: true },
        { text: ", and " },
        { text: "breathwork ", bold: true },
        {
          text: "to let go things that no longer serve you. Indulge yourself even more at our ",
        },
        { text: "Mahamaya SPA", bold: true },
        {
          text: " with a collection of delightful spa treatments that will pamper your body and soul.",
        },
      ],
      ctas: [
        {
          label: "Spa Menu",
          href: "/uploads/2024/12/Spa-Menu-Suite.pdf",
          external: true,
        },
        {
          label: "Resort Activities",
          href: "/uploads/2025/07/Resort-Activities-1.pdf",
          external: true,
        },
        {
          label: "Wellness Menu",
          href: "/uploads/2025/01/Wellness-Menu-Suite.pdf",
          external: true,
        },
        {
          label: "Book the Spa",
          href: "https://www.fresha.com/book-now/mahamaya-spa-at-ubud-nyuh-bali-resort-ey5svh4w/all-offer?pId=1163981",
          external: true,
        },
      ],
    },
    {
      name: "Enhance your Stay",
      images: [`${UPLOADS}/2023/05/Cooking-Class.webp`],
      description:
        "Let us help you to make your stay comfortable. Discover our thoughtful perks to help enhance your stay. We also could arrange a personalized romantic arrangement such as a birthday treat, anniversary gift, or even just a little surprise for her. Please let us know your preference, and we will explore all possibilities.",
      ctas: [
        {
          label: "Enhance your Stay",
          href: "/uploads/2025/07/Enhance-your-stay-Ubud-Suite-1.pdf",
          external: true,
        },
      ],
    },
    {
      name: "Dining Experience",
      images: [`${UPLOADS}/2023/03/ubud-dining-2.webp`],
      description:
        "Enjoy tasty foods with personalized service at our Lumbini Restaurant. There are no substitutes for quality; our team is committed to serving the finest quality ingredients and freshest food every day.",
      ctas: [
        {
          label: "Candle Light Dinner",
          href: "/uploads/2023/11/CLD-Menu-Ubud.pdf",
          external: true,
        },
        {
          label: "All Day Menu",
          href: "/uploads/2025/10/Ala-Carte-Suite.pdf",
          external: true,
        },
        {
          label: "Breakfast",
          href: "/uploads/2024/08/Breakfast-Menu-Ubud-Nyuh-Bali-Resort.pdf",
          external: true,
        },
        {
          label: "Healthy Menu",
          href: "/uploads/2024/02/Earthy-Menu.pdf",
          external: true,
        },
      ],
    },
    {
      name: "Useful Information",
      images: [`${UPLOADS}/2022/12/Ubud-useful-information.jpeg`],
      description:
        "Please find the information about our facilities and services in detail. Should you need any assistance, simply call 300 (07.00 - 23.00) or 301 (23.00 - 07.00) from your room or +6282238882229 if you are outside of the resort. Our team is available for 24 hours to assist you.",
      ctas: [
        {
          label: "Resort Map",
          href: "/uploads/2026/03/Resort-map-Ubud-Nyuh-Bali.pdf",
          external: true,
        },
        {
          label: "Room Directory",
          href: "/uploads/2023/05/Room-directory-ubud-suite.pdf",
          external: true,
        },
        {
          label: "Minibar List",
          href: "/uploads/2023/05/Minibar-list-suite.png",
          external: true,
        },
        {
          label: "Shuttle Schedule",
          href: "/uploads/2023/12/Shuttle-Schedule-Ubud-Nyuh-Bali-Resort.pdf",
          external: true,
        },
        {
          label: "WhatsApp",
          href: "https://api.whatsapp.com/send?phone=6282238882229",
          external: true,
          variant: "outline",
        },
      ],
    },
  ],
};

/**
 * Staff onboarding — the five steps a new team member completes.
 *
 * Not a guest page and not a directory; it shares this file only because it
 * shares the layout. It is published, indexable and linked from nothing on
 * the live site, and it is reproduced here so the links already handed to new
 * staff keep working. Its emphasis is load-bearing rather than decorative —
 * the pass mark, and that initials will not be accepted — which is why
 * `PackageRun` exists.
 *
 * Its five actions leave the site entirely: two PDFs, a Google Form quiz, a
 * JotForm signature invite and a Google Form database, all the live page's
 * own URLs, unchanged.
 */
export const WELCOME_ABOARD: DirectoryPageContent = {
  heading: "Welcome Aboard",
  intro: [
    {
      text: "We are thrilled to have you join our team and embark on this exciting journey with us. As part of our commitment to excellence, there are five mandatory steps you will need to complete to officially become a member of our team and ",
    },
    { text: "redeem your salary", bold: true },
    {
      text: ". These steps are designed to ensure that you are equipped with the knowledge and skills necessary to uphold our high standards and provide exceptional service.",
    },
  ],
  items: [
    {
      name: "Step 1 : Basic Product Knowledge",
      images: [`${UPLOADS}/2023/06/image-7-1024x683-1.webp`],
      description:
        "Familiarize yourself with the resort’s offerings, including our accommodations, dining experiences, spa services, and recreational activities. This knowledge will help you answer questions and assist guests with confidence, ensuring that they have a seamless and enjoyable stay with us.",
      ctas: [
        {
          label: "Product Knowledge",
          href: "/uploads/2024/11/Basic-Product-Knowledge.pdf",
          external: true,
        },
      ],
    },
    {
      name: "Step 2 : Nyuh Bali Manner",
      images: [`${UPLOADS}/2023/05/IS_06754-min-1.webp`],
      description:
        "At Ubud Nyuh Bali, we pride ourselves on the “Nyuh Bali Manner” – a distinctive approach to hospitality that emphasizes warmth, respect, and a personalized experience. By learning this philosophy, you’ll understand how we engage with our guests and create genuine connections. It’s all about anticipating needs, offering thoughtful service, and ensuring every guest feels truly at home.",
      ctas: [
        {
          label: "Nyuh Bali Manner",
          href: "/uploads/2024/11/Nyuh-Bali-Manner.pdf",
          external: true,
        },
      ],
    },
    {
      name: "Step 3 : Test your Knowledge",
      images: [`${UPLOADS}/2023/05/Cooking-Class.webp`],
      description: [
        {
          text: "After reviewing the product knowledge and Nyuh Bali Manner, you’ll complete a brief quiz to test your understanding. A ",
        },
        { text: "minimum score of 75% ", bold: true },
        {
          text: "is required to ensure that you are fully prepared to deliver the high standard of service we are known for",
        },
      ],
      ctas: [
        {
          label: "Initial Test",
          href: "https://forms.gle/sgQnB6Vi7YYah8Ak6",
          external: true,
        },
      ],
    },
    {
      name: "Step 4 : Sign the House Rule",
      images: [`${UPLOADS}/2023/03/Two-Bedroom-Pool-Villa-2.webp`],
      description: [
        {
          text: "As part of our team, it’s essential that you understand and agree to the House Rules. These guidelines ensure that our workplace remains safe, respectful, and professional for both our guests and staff. ",
        },
        {
          text: "Please note that your signature is required; initials will not be accepted.",
          bold: true,
        },
      ],
      ctas: [
        {
          label: "Sign the House Rule",
          href: "https://www.jotform.com/sign/242981747384066/invite/01jb1c7x4b6921623d624927b9",
          external: true,
        },
      ],
    },
    {
      name: "Step 5 : Fill the Database",
      images: [`${UPLOADS}/2022/12/Ubud-useful-information.jpeg`],
      description:
        "Please ensure that all information is accurate and up-to-date, as we will extract your data directly from this database. Failure to provide correct information will not be our responsibility. It is important to double-check everything you input. Please make sure to upload your signed House Rules in PDF format (this document will be sent to you via email) and submit a screenshot of your quiz result showing a minimum score of 75%.",
      ctas: [
        {
          label: "Fill the Database",
          href: "https://docs.google.com/forms/d/e/1FAIpQLSfY81_Dt4EPjguPEap3MIA5oy2Vh-kxfONvoQ9XWNcKoHGngA/viewform?usp=sf_link",
          external: true,
        },
        {
          label: "WhatsApp",
          href: "https://api.whatsapp.com/send?phone=6282238882229",
          external: true,
          variant: "outline",
        },
      ],
    },
  ],
};
