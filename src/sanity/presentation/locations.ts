import { defineLocations } from "sanity/presentation";

export const presentationLocations = {
  page: defineLocations({
    select: { title: "title", path: "path" },
    resolve: (document) => ({
      locations: document?.path
        ? [{ title: document.title || "Page", href: document.path }]
        : [],
    }),
  }),
  post: defineLocations({
    select: { title: "title", path: "path" },
    resolve: (document) => ({
      locations: document?.path
        ? [{ title: document.title || "Blog post", href: document.path }]
        : [],
    }),
  }),
  room: defineLocations({
    select: { title: "title", slug: "slug.current", property: "property" },
    resolve: (document) => ({
      locations:
        document?.slug && document?.property
          ? [
              {
                title: document.title || "Room",
                href: `/${document.property}/villa/${document.slug}`,
              },
            ]
          : [],
    }),
  }),
  experience: defineLocations({
    // Experiences all live under /ubud/ — the retreat, wellness and culture
    // programmes are Ubud's alone; Seminyak publishes none.
    select: { title: "title", slug: "slug" },
    resolve: (document) => ({
      locations: document?.slug
        ? [{ title: document.title || "Experience", href: `/ubud/${document.slug}` }]
        : [],
    }),
  }),
  legalPage: defineLocations({
    select: { title: "title", path: "path" },
    resolve: (document) => ({
      locations: document?.path
        ? [{ title: document.title || "Legal page", href: document.path }]
        : [],
    }),
  }),
};
