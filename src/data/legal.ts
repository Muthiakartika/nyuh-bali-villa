// Terms & Conditions and Privacy Policy are the two pages the live site
// treats as shared/global rather than per-property — both render with the
// Ubud site's header and footer regardless of which property a visitor
// came from (confirmed by inspecting the live pages directly), and neither
// shows the DirectBookingDeals widget that appears on every other property
// page. That's replicated as-is here rather than "fixed" into something
// more symmetric.
export type LegalSection = {
  heading: string;
} & (
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
);

export const TERMS_CONDITIONS_SECTIONS: LegalSection[] = [
  {
    heading: "1. Acceptance of Terms",
    type: "paragraph",
    text: "By booking or staying at Nyuh Bali Villas (“we,” “our,” “us”), guests (“you,” “your”) agree to these Terms & Conditions.",
  },
  {
    heading: "2. Reservations & Payments",
    type: "list",
    items: [
      "All bookings must be confirmed through our official website or authorized partners.",
      "A deposit may be required to secure reservations; balance payments are due before check‑in.",
      "Rates are quoted in Indonesian Rupiah (IDR) and may vary by villa location (Seminyak or Ubud).",
    ],
  },
  {
    heading: "3. Check‑In & Check‑Out",
    type: "list",
    items: [
      "Standard check‑in: 3:00 PM; check‑out: 12:00 PM.",
      "Early check‑in or late check‑out is subject to availability and may incur additional charges.",
    ],
  },
  {
    heading: "4. Cancellation & Refunds",
    type: "list",
    items: [
      "Cancellation policies vary depending on booking type (flexible, non‑refundable, promotional).",
      "Refunds, if applicable, will be processed in accordance with the original payment method.",
      "No‑shows or early departures are non‑refundable.",
    ],
  },
  {
    heading: "5. Guest Responsibilities",
    type: "list",
    items: [
      "Guests must respect villa property, staff, and local community.",
      "We are non smoking property.",
      "Pets are not allowed unless explicitly approved.",
      "Any damage caused by guests may result in additional charges.",
    ],
  },
  {
    heading: "6. Villa Services & Facilities",
    type: "list",
    items: [
      "Villas in Seminyak and Ubud may offer different amenities (e.g., spa services, private pools, transport).",
      "Complimentary services (Wi‑Fi, breakfast, housekeeping) are provided unless otherwise stated.",
      "Special requests (airport transfers, tours, wellness treatments) are subject to availability and additional fees.",
    ],
  },
  {
    heading: "7. Liability & Disclaimers",
    type: "list",
    items: [
      "Nyuh Bali Villas is not liable for accidents, injuries, or loss of personal belongings during your stay.",
      "Guests are responsible for their own travel insurance.",
      "We are not responsible for disruptions caused by external factors (e.g., weather, government regulations, natural events).",
    ],
  },
  {
    heading: "8. Privacy & Data Protection",
    type: "list",
    items: [
      "Personal information collected during booking is used solely for reservation and service purposes.",
      "Data is handled in accordance with our Privacy Policy.",
    ],
  },
  {
    heading: "9. Governing Law",
    type: "list",
    items: [
      "These Terms are governed by the laws of Indonesia.",
      "Any disputes will be resolved under the jurisdiction of Indonesian courts.",
    ],
  },
  {
    heading: "10. Changes to Terms",
    type: "list",
    items: [
      "Nyuh Bali Villas may update these Terms & Conditions at any time.",
      "Continued use of our services after changes constitutes acceptance of the revised Terms.",
    ],
  },
];

export const PRIVACY_POLICY_SECTIONS: LegalSection[] = [
  {
    heading: "1. Introduction",
    type: "paragraph",
    text: "Nyuh Bali Villas (“we,” “our,” “us”) values your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you book or stay at our villas in Seminyak and Ubud.",
  },
  {
    heading: "2. Information We Collect",
    type: "list",
    items: [
      "Booking Information: Name, email, phone number, nationality, and stay details.",
      "Payment Information: Credit card or bank transfer details processed securely via authorized providers.",
      "Guest Preferences: Requests for services (spa, transfers, tours, dining).",
      "Technical Data: IP address, browser type, and cookies when using our website.",
    ],
  },
  {
    heading: "3. How We Use Information",
    type: "list",
    items: [
      "To confirm and manage villa reservations.",
      "To provide personalized guest services during your stay.",
      "To process payments securely.",
      "To send booking confirmations, updates, and promotional offers (with consent).",
      "To comply with Indonesian legal requirements.",
    ],
  },
  {
    heading: "4. Data Sharing",
    type: "list",
    items: [
      "We do not sell guest data.",
      "Data may be shared with trusted service providers (payment gateways, booking platforms, transport partners).",
      "Information may be disclosed to authorities if required by Indonesian law.",
    ],
  },
  {
    heading: "5. Cookies & Tracking",
    type: "list",
    items: [
      "Our website uses cookies to improve user experience and track booking activity.",
      "Guests may disable cookies in their browser, but some features may not function properly.",
    ],
  },
  {
    heading: "6. Data Security",
    type: "list",
    items: [
      "We implement encryption and secure systems to protect guest data.",
      "While we strive for security, no method of transmission is 100% secure.",
    ],
  },
  {
    heading: "7. Guest Rights",
    type: "list",
    items: [
      "Access, correction, or deletion of personal data upon request.",
      "Withdrawal of consent for marketing communications.",
      "Complaints may be filed with Indonesian data protection authorities under PDP Law.",
    ],
  },
  {
    heading: "8. International Guests",
    type: "paragraph",
    text: "Data may be processed in Indonesia and transferred internationally if bookings are made via global platforms.",
  },
  {
    heading: "9. Children’s Privacy",
    type: "list",
    items: [
      "Our services are not directed to individuals under 13 years of age.",
      "We do not knowingly collect data from children.",
    ],
  },
  {
    heading: "10. Changes to Policy",
    type: "list",
    items: [
      "Nyuh Bali Villas may update this Privacy Policy from time to time.",
      "Continued use of our services after changes constitutes acceptance.",
    ],
  },
  {
    // Note the Ubud email here is genuinely "info@ubudnyuhbali.co" (no
    // "m") on the live page — different from "info@ubudnyuhbali.com" used
    // in the site footer. That inconsistency is in the source content
    // itself, not a transcription error introduced here.
    heading: "11. Contact Us",
    type: "list",
    items: [
      "Seminyak location: Bali Deli st 99, Seminyak, Bali\nreservation@nyuhbalivillas.com",
      "Ubud location: Raya Silungan street Lodtunduh Ubud Bali\ninfo@ubudnyuhbali.co",
    ],
  },
];
