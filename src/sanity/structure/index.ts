import type { StructureResolver } from "sanity/structure";

const singletonTypes = new Set(["siteSettings"]);

/**
 * Required on any `documentTypeList` carrying a custom `.filter()`.
 *
 * Without it the Studio logs "No apiVersion specified for document type list
 * with custom filter … This will be required in the future" once per list on
 * every load — five of them here, which is most of the console noise an editor
 * sees. Matches the version the rest of the project queries with.
 */
const STRUCTURE_API_VERSION = "2023-05-03";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Pages")
        .schemaType("page")
        .child(S.documentTypeList("page").title("Pages")),
      S.divider(),
      S.listItem()
        .title("Blog posts")
        .schemaType("post")
        .child(S.documentTypeList("post").title("Blog posts")),
      S.listItem()
        .title("Blog categories")
        .schemaType("category")
        .child(S.documentTypeList("category").title("Blog categories")),
      S.divider(),
      // Rooms and experiences are the two collections an editor opens most,
      // and both are meaningless without knowing which resort they belong to
      // — so each is split by property rather than listed as one flat set of
      // similarly-named villas.
      S.listItem()
        .title("Rooms and villas")
        .schemaType("room")
        .child(
          S.list()
            .title("Rooms and villas")
            .items([
              S.listItem()
                .title("Seminyak")
                .child(
                  S.documentTypeList("room")
                    .title("Seminyak rooms")
                    .filter('_type == "room" && property == "seminyak"')
                    .apiVersion(STRUCTURE_API_VERSION),
                ),
              S.listItem()
                .title("Ubud")
                .child(
                  S.documentTypeList("room")
                    .title("Ubud rooms")
                    .filter('_type == "room" && property == "ubud"')
                    .apiVersion(STRUCTURE_API_VERSION),
                ),
            ]),
        ),
      S.listItem()
        .title("Experiences")
        .schemaType("experience")
        .child(
          S.list()
            .title("Experiences")
            .items([
              S.listItem()
                .title("Retreats")
                .child(
                  S.documentTypeList("experience")
                    .title("Retreats")
                    .filter('_type == "experience" && group == "retreat"')
                    .apiVersion(STRUCTURE_API_VERSION),
                ),
              S.listItem()
                .title("Wellness")
                .child(
                  S.documentTypeList("experience")
                    .title("Wellness")
                    .filter('_type == "experience" && group == "wellness"')
                    .apiVersion(STRUCTURE_API_VERSION),
                ),
              S.listItem()
                .title("Balinese culture")
                .child(
                  S.documentTypeList("experience")
                    .title("Balinese culture")
                    .filter('_type == "experience" && group == "culture"')
                    .apiVersion(STRUCTURE_API_VERSION),
                ),
            ]),
        ),
      S.listItem()
        .title("Package sets")
        .schemaType("packageSet")
        .child(S.documentTypeList("packageSet").title("Package sets")),
      S.listItem()
        .title("Testimonials")
        .schemaType("testimonial")
        .child(S.documentTypeList("testimonial").title("Testimonials")),
      S.divider(),
      S.listItem()
        .title("Legal pages")
        .schemaType("legalPage")
        .child(S.documentTypeList("legalPage").title("Legal pages")),
      S.listItem()
        .title("Properties")
        .schemaType("property")
        .child(S.documentTypeList("property").title("Properties")),
      S.listItem()
        .title("Site settings")
        .schemaType("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
    ]);

/** Prevent duplicate singleton documents in global create menus. */
export const newDocumentOptions = <T extends { templateId: string }>(items: T[]) =>
  items.filter((item) => !singletonTypes.has(item.templateId));
