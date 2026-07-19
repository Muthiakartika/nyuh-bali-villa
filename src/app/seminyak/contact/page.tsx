import type { Metadata } from "next";
import Image from "next/image";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { DirectBookingDeals } from "@/components/property/DirectBookingDeals";
import { ContactForm } from "@/components/property/ContactForm";
import { PROPERTY_SITES } from "@/data/properties";

const site = PROPERTY_SITES.seminyak;

export const metadata: Metadata = {
  title: "Seminyak - Contact Us - Nyuh Bali",
};

// Unlike the About page, Contact has no hero slider or booking bar — just a
// two-column split (a static photo, then the form) directly below the
// header, confirmed by inspecting the page's actual structure rather than
// assuming it would mirror the About page's layout.
export default function SeminyakContactPage() {
  return (
    <>
      <PropertyHeader site={site} activeHref="/seminyak/contact" />
      <main className="flex flex-col gap-10 px-5 py-16 md:flex-row md:gap-10 md:px-[92px]">
        <div className="relative aspect-[3/2] w-full md:w-1/2">
          <Image
            src="https://nyuhbalivillas.com/wp-content/uploads/2023/03/Contact-us-seminyak.webp"
            alt="Nyuh Bali Villas Seminyak"
            fill
            sizes="(min-width: 768px) 540px, 100vw"
            className="object-cover"
            priority
          />
        </div>
        <div className="w-full md:w-1/2">
          <ContactForm />
        </div>
      </main>
      <PropertyFooter site={site} />
      <DirectBookingDeals bookingHref={site.bookingHref} />
    </>
  );
}
