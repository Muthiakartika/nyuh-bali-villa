import type { Metadata } from "next";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { DirectBookingDeals } from "@/components/property/DirectBookingDeals";
import { ContactPanel } from "@/components/property/ContactPanel";
import ManagedPage from "@/components/sanity/ManagedPage";
import { getPropertySite } from "@/sanity/lib/content";
import { resolvePageMetadata } from "@/sanity/lib/metadata";


export async function generateMetadata(): Promise<Metadata> {
  // A published `page` document's SEO wins; otherwise this stays
  // exactly the live site's title and description from src/data/seo.ts.
  return resolvePageMetadata("/seminyak/contact");
}

/**
 * Contact has no hero slider or booking bar — confirmed by inspecting the
 * live page's structure rather than assuming it mirrors the About page.
 *
 * With no hero to open on, the page leads with a proper title block, which the
 * old version lacked entirely: it dropped the visitor straight into a photo and
 * a form with nothing naming the page they'd landed on. (The header is the same
 * solid bar as everywhere else — it no longer has a transparent variant.)
 */
export default async function SeminyakContactPage() {
  const site = await getPropertySite("seminyak");
  return (
    <>
      <PropertyHeader site={site} activeHref="/seminyak/contact" />
      <main>
        {/* The page body is one component so a CMS-authored contact
            page renders the same markup — publish a `page` document at
            this path and its sections take over. */}
        <ManagedPage path="/seminyak/contact" fallbackProperty="seminyak">
          <ContactPanel
            eyebrow={site.label}
            heading="Contact Us"
            imageSrc="https://nyuhbalivillas.com/wp-content/uploads/2023/03/Contact-us-seminyak.webp"
            imageAlt="Nyuh Bali Villas Seminyak"
          />
        </ManagedPage>
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
