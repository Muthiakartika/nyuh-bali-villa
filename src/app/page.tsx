import type { Metadata } from "next";
import { HomeHeader } from "@/components/home/HomeHeader";
import { HomeFooter } from "@/components/home/HomeFooter";
import { PropertyPanel } from "@/components/home/PropertyPanel";
import { BookNowRibbon } from "@/components/layout/BookNowRibbon";
import ManagedPage from "@/components/sanity/ManagedPage";
import { resolvePageMetadata } from "@/sanity/lib/metadata";
import { HOME_PANELS } from "@/data/pages/home";

// Home used to be the one route with no metadata of its own, inheriting the
// root layout's. That happened to be right — the layout's title and
// description were themselves copied from the live homepage — but it left the
// most important page on the site as the only one whose head wasn't stated
// where the others state theirs.
export async function generateMetadata(): Promise<Metadata> {
  // A published `page` document's SEO wins; otherwise this stays exactly the
  // live site's title and description from src/data/seo.ts.
  return resolvePageMetadata("/");
}

// The homepage's ribbon links to a "group" booking page (lets the visitor
// choose either property once they land on the booking engine), unlike the
// per-property pages, which link straight to that property's own booking page.
const GROUP_BOOKING_HREF =
  "https://booking.nyuhbalivillas.com/inst/#group?groupId=661MB8ZgvnAogj7QoCG4WJtr8FTILhqyXViqajI5ODY=&JDRN=Y";

/**
 * The Home route — the Seminyak/Ubud picker.
 *
 * The redesign turns this from "a page containing two cards" into "a page that
 * *is* the choice": two full-height photographs meeting at a seam, with the
 * header and footer laid over them instead of boxing them in. There is nothing
 * else on this page for a visitor to do, so there is nothing else on it.
 *
 * `relative` is what the absolutely-positioned header and footer anchor to.
 *
 * This stays a Server Component — the only interactive piece is the mobile
 * menu toggle, which is isolated inside HomeHeader rather than forcing this
 * whole page to ship as client-side JS.
 */
export default async function Home() {
  return (
    <div className="relative min-h-screen">
      <HomeHeader />

      {/* Gapless on purpose: the seam where the two photographs meet is the
          division, and it does the job a gutter used to do without spending
          any of the screen on empty space. */}
      <main className="grid md:grid-cols-2">
        {/* The panels below are the fallback: publish a `page` document at
            "/" and its sections render instead, with the header, footer and
            booking ribbon unchanged. `fallbackProperty` is unused by this
            page — the picker section takes no property — but ManagedPage
            resolves a site for the per-property sections, so it needs one. */}
        <ManagedPage path="/" fallbackProperty="ubud">
          {HOME_PANELS.map((panel, index) => (
            <PropertyPanel
              key={panel.href}
              headingLevel={index === 0 ? "h1" : "h2"}
              name={panel.name}
              description={panel.description}
              imageSrc={panel.imageSrc}
              href={panel.href}
            />
          ))}
        </ManagedPage>
      </main>

      <HomeFooter />
      <BookNowRibbon href={GROUP_BOOKING_HREF} />
    </div>
  );
}
