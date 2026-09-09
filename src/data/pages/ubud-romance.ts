// Content for src/app/ubud/villa/honeymoon/packages/page.tsx.
//
// It lives here rather than in the route for one reason: the Sanity migration
// seeds this page's `page` document from these exact constants, and a module
// that imports React or `server-only` cannot be read by a plain Node script.
// One copy, so the CMS cannot drift from the page it was seeded from.

export const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads";

// Photographs verified against this route on the live site, 2026-09-04.
// Not `honeymoon-ubud` — that is the Honeymoon Getaway package's own
// photograph in the list below, and no picture may appear twice on a page.
export const HERO_IMAGES = [
  `${UPLOADS}/2023/03/Honeymoon-Pool-Villa-1.webp`,
];
