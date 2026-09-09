import type { Metadata } from "next";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { DirectBookingDeals } from "@/components/property/DirectBookingDeals";
import { ContactPanel } from "@/components/property/ContactPanel";
import ManagedPage from "@/components/sanity/ManagedPage";
import { getPropertySite } from "@/sanity/lib/content";
import { resolvePageMetadata } from "@/sanity/lib/metadata";


// Not copied verbatim — the live /ubud/contact/ never actually renders its
// own <title> (see the routing-bug note below), so this follows the exact
// naming pattern Seminyak's real title uses ("Seminyak - Contact Us -
// Nyuh Bali") rather than leaving it untitled.
export async function generateMetadata(): Promise<Metadata> {
  // A published `page` document's SEO wins; otherwise this stays
  // exactly the live site's title and description from src/data/seo.ts.
  return resolvePageMetadata("/ubud/contact");
}

// The live nyuhbalivillas.com/ubud/contact/ currently misroutes — every
// navigation method (direct URL, clicking the real footer link) lands on the
// Seminyak contact page's cached content instead, and no distinct document
// request for that URL ever appears in the network log. That appears to be a
// real bug/caching issue on the live site itself, not something to reproduce.
// Its contact photo still genuinely exists, though — confirmed via the
// WordPress REST API (wp-json/wp/v2/media?search=contact-us), which returned a
// real "contact-us-ubud.webp" attachment uploaded specifically for this page —
// so this uses that real asset with Ubud's own header/footer/form.
export default async function UbudContactPage() {
  const site = await getPropertySite("ubud");
  return (
    <>
      <PropertyHeader site={site} activeHref="/ubud/contact" />
      <main>
        {/* The page body is one component so a CMS-authored contact
            page renders the same markup — publish a `page` document at
            this path and its sections take over. */}
        <ManagedPage path="/ubud/contact" fallbackProperty="ubud">
          <ContactPanel
            eyebrow={site.label}
            heading="Contact Us"
            imageSrc="https://nyuhbalivillas.com/wp-content/uploads/2023/03/contact-us-ubud.webp"
            imageAlt="Nyuh Bali Villas Ubud"
            intro={"Please complete this form to reach us. Our team will get back to you within 24 hours."}
          />
        </ManagedPage>
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
