/**
 * Creates one `page` document that exercises the page builder, so the
 * renderer can be seen working without hand-building a page in the Studio
 * first.
 *
 *   npm run sanity:seed-demo          # create it
 *   npm run sanity:seed-demo -- --remove   # delete it again
 *
 * It publishes at `/cms-renderer-test`, which the catch-all route in
 * `src/app/[...slug]/page.tsx` serves. Remove it before deploying — it is a
 * demonstration, not content.
 */
import { createClient } from "@sanity/client";
import { getCliClient } from "sanity/cli";

const remove = process.argv.includes("--remove");
const DOC_ID = "page-cms-renderer-test";
const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads/";

const writeToken = process.env.SANITY_API_WRITE_TOKEN?.trim();
const client = writeToken
  ? createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || "",
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production",
      apiVersion: "2025-02-19",
      token: writeToken,
      useCdn: false,
    })
  : getCliClient({ apiVersion: "2025-02-19" });

const image = (file: string, alt: string) => ({
  _type: "imageWithAlt" as const,
  alt,
  externalUrl: UPLOADS + file,
});

const demoPage = {
  _id: DOC_ID,
  _type: "page",
  title: "Renderer test",
  path: "/cms-renderer-test",
  property: "ubud",
  sections: [
    {
      _type: "heroSection",
      _key: "s1",
      eyebrow: "Nyuh Bali Villas",
      title: "Renderer Test",
      alt: "Renderer test hero",
      images: [{ ...image("2025/01/home-ubud-compress.webp", "Renderer test hero"), _key: "i1" }],
    },
    {
      _type: "richTextSection",
      _key: "s2",
      tone: "sand",
      eyebrow: "Section",
      heading: "Rich text",
      body: [
        {
          _type: "block",
          _key: "b1",
          style: "normal",
          markDefs: [],
          children: [
            { _type: "span", _key: "c1", text: "A paragraph with ", marks: [] },
            { _type: "span", _key: "c2", text: "strong text", marks: ["strong"] },
            { _type: "span", _key: "c3", text: " inside it.", marks: [] },
          ],
        },
      ],
    },
    {
      _type: "splitContentSection",
      _key: "s3",
      tone: "sand-deep",
      heading: "Text with image",
      paragraphs: ["First paragraph of the split block.", "Second paragraph."],
      imageSide: "right",
      image: image("2023/03/Suite-1.webp", "Suite"),
      action: {
        _type: "link",
        label: "Book Now",
        href: "https://example.com",
        external: true,
        inScope: true,
        variant: "solid",
      },
    },
    {
      _type: "bulletListSection",
      _key: "s4",
      tone: "sand",
      heading: "Inclusions",
      groups: [
        {
          _type: "bulletGroup",
          _key: "g1",
          heading: "Included",
          items: ["Daily breakfast", "Airport transfer"],
        },
      ],
    },
    {
      _type: "priceTableSection",
      _key: "s5",
      tone: "sand-deep",
      heading: "Rates",
      table: {
        _type: "priceTable",
        columns: ["Service", "Duration", "Cost (IDR)"],
        rows: [
          { _type: "priceRow", _key: "r1", cells: ["Balinese Massage", "60 mins", "450.000"] },
          { _type: "priceRow", _key: "r2", cells: ["Flower Bath", "30 mins", "250.000"] },
        ],
      },
    },
    {
      _type: "collectionSection",
      _key: "s6",
      tone: "sand",
      heading: "Our Villas",
      collection: "room",
      property: "ubud",
      limit: 3,
    },
    {
      _type: "faqSection",
      _key: "s7",
      tone: "sand-deep",
      heading: "FAQ",
      faqs: [
        {
          _type: "faqItem",
          _key: "f1",
          question: "Is this a test?",
          answer: "Yes — it exercises every branch of the page builder.",
        },
      ],
    },
    {
      _type: "ctaSection",
      _key: "s8",
      tone: "sand",
      heading: "Ready to stay?",
      body: "Book direct for the best rate.",
      actions: [
        {
          _type: "link",
          _key: "a1",
          label: "Book Now",
          href: "https://example.com",
          external: true,
          inScope: true,
          variant: "solid",
        },
      ],
    },
  ],
  seo: {
    _type: "seo",
    title: "Renderer test",
    description: "Temporary page exercising the page builder.",
    noIndex: true,
  },
};

async function main() {
  if (remove) {
    await client.delete(DOC_ID);
    console.log(`Deleted ${DOC_ID}.`);
    return;
  }
  await client.createOrReplace(demoPage);
  console.log(`Created ${DOC_ID} at ${demoPage.path}`);
  console.log(`Sections: ${demoPage.sections.map((s) => s._type).join(", ")}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
