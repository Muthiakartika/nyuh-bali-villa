import type { InquiryField } from "@/components/property/InquiryForm";

/**
 * The Personalize Your Retreat form, /ubud-personalize-your-retreat.
 *
 * Here rather than in the route for the reason every other page's content is
 * here: the Sanity migration seeds this page's `page` document from these
 * same constants, and a plain Node script cannot import a module that pulls
 * in React. One copy means a seeded document cannot drift from the page it
 * was seeded from.
 */
export const PERSONALIZE_RETREAT_HEADING = "Personalize Your Retreat";

export const PERSONALIZE_RETREAT_SUBMIT_LABEL = "Send";

export const PERSONALIZE_RETREAT_CONFIRMATION =
  "Thank you — our retreat specialist will be in touch with a proposal shortly.";

// The live form's seven numbered sections, field for field and in order. The
// section numbers are kept in the labels because they are part of the live
// copy, and they are what makes a form this long navigable.
export const PERSONALIZE_RETREAT_FIELDS: InquiryField[] = [
  { kind: "text", name: "name", label: "Name", required: true },
  { kind: "text", name: "event", label: "Event" },
  { kind: "text", name: "website", label: "Website" },
  { kind: "email", name: "email", label: "Email", required: true },

  { kind: "date", name: "check-in", label: "1. Your Desired Date — Check-in" },
  { kind: "date", name: "check-out", label: "Check-out" },
  { kind: "text", name: "flexibility", label: "Flexibility +/- days" },
  {
    kind: "number",
    name: "people",
    label: "How many people are you expecting?",
    required: true,
  },
  {
    kind: "number",
    name: "rooms",
    label: "How many rooms do you require?",
    required: true,
  },

  {
    kind: "radio",
    name: "board",
    label: "2. Dining Plan — Choices",
    required: true,
    options: ["Full board", "Half board", "Breakfast only"],
  },
  {
    kind: "checkbox",
    name: "dietary",
    label: "Dietary requirements",
    options: [
      "Vegetarian",
      "Vegan",
      "Mediterranean",
      "Pescatarian",
      "High protein",
      "Gluten free",
      "Balinese style",
      "Regular food",
    ],
  },
  {
    kind: "radio",
    name: "detox-juice",
    label: "Daily Detox Juice",
    options: ["Yes, please", "No, thank you"],
  },
  {
    kind: "radio",
    name: "jamu",
    label: "Daily Balinese Jamu",
    options: ["Yes, please", "No, thank you"],
  },
  {
    kind: "radio",
    name: "snack-bar",
    label: "Dedicated Snack Bar",
    options: ["Yes, please", "No, thank you"],
  },

  {
    kind: "radio",
    name: "massage",
    label: "3. Adds ON — Balinese Massage",
    options: ["Yes, please", "No, thank you"],
  },
  {
    kind: "radio",
    name: "movie-night",
    label: "Movie Night",
    options: ["Yes, please", "No, thank you"],
  },
  {
    kind: "radio",
    name: "cooking-class",
    label: "Balinese Cooking Class",
    options: ["Yes, please", "No, thank you"],
  },
  {
    kind: "radio",
    name: "photography",
    label: "Photography service",
    options: ["Yes, please", "No, thank you"],
  },
  {
    kind: "radio",
    name: "airport-transfer",
    label: "Airport Transfer",
    options: ["Yes, please", "No, thank you"],
  },
  {
    kind: "radio",
    name: "island-trips",
    label: "Island Trips",
    options: ["Full day (10 hours)", "Half day (5 hours)", "No, thank you"],
  },
  {
    kind: "radio",
    name: "batur-trekking",
    label: "Mt Batur Sunrise Trekking",
    options: ["Yes, please", "No, thank you"],
  },
  {
    kind: "radio",
    name: "rafting",
    label: "Rafting",
    options: ["Yes, please", "No, thank you"],
  },
  {
    kind: "radio",
    name: "floating-breakfast",
    label: "Floating Breakfast",
    options: ["Yes, please", "No, thank you"],
  },

  {
    kind: "textarea",
    name: "decoration",
    label:
      "4. Do you require unique decoration during your retreat? (eg : flower decoration on the teak wood)",
  },
  {
    kind: "checkbox",
    name: "equipment",
    label: "5. Equipment",
    options: [
      "Yoga matt",
      "Yoga blocks",
      "Yoga strap",
      "Meditation cushion",
      "Microphone",
      "Projector & screen",
      "Speakers for Music",
      "Whiteboard",
    ],
  },
  {
    kind: "textarea",
    name: "printing",
    label:
      "6. Please specify if you need to print retreat manuals or order customized merchandise for your students",
  },
  {
    kind: "textarea",
    name: "additional",
    label: "7. Is there any additional information you would like requests?",
  },
];
