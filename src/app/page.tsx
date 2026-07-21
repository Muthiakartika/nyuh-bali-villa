import { HomeHeader } from "@/components/home/HomeHeader";
import { HomeFooter } from "@/components/home/HomeFooter";
import { PropertyPanel } from "@/components/home/PropertyPanel";
import { BookNowRibbon } from "@/components/layout/BookNowRibbon";
import { Container } from "@/components/ui/Container";

// The homepage's ribbon links to a "group" booking page (lets the visitor
// choose either property once they land on the booking engine), unlike the
// per-property pages later in this project, which will link straight to
// that property's own booking page.
const GROUP_BOOKING_HREF =
  "https://booking.nyuhbalivillas.com/inst/#group?groupId=661MB8ZgvnAogj7QoCG4WJtr8FTILhqyXViqajI5ODY=&JDRN=Y";

// The Home route: `src/app/page.tsx` maps to `/` in the App Router simply by
// its file location — no routing configuration needed. This stays a Server
// Component (no "use client"); the interactive pieces (the mobile menu
// toggles) are isolated inside HomeHeader/HomeFooter instead of forcing this
// whole page to ship as client-side JS.
export default function Home() {
  return (
    <>
      <HomeHeader />

      {/* The two panels sit inside the same 1080px Container as every other
          section, so each half is 540px wide. A `grid` with a real gap
          replaces the old edge-to-edge flex row — the gutter between the two
          cards is what makes them read as two distinct choices rather than
          one continuous block, and the vertical padding gives them room to
          breathe against the header and footer. */}
      {/* `flex-1` makes this stretch to fill whatever height is left between
          the header and footer (see the body's flex column in layout.tsx),
          and `justify-center` then centres the two cards in that space — so
          the picker sits precisely in the middle of the screen instead of
          hugging the top and leaving white space under the footer. */}
      {/* `bg-ink/5` is the brand's dark brown at 5% — a warm off-white, not a
          new colour in the palette. The header and footer stay dark, so the
          page reads as dark chrome framing a light middle: no stark white at
          the top, but not wall-to-wall brown either. */}
      <main className="flex flex-1 flex-col justify-center bg-ink/5 px-5 py-10 md:py-14">
        <Container className="grid gap-5 md:grid-cols-2 md:gap-6">
          <PropertyPanel
            headingLevel="h1"
            name="SEMINYAK"
            description="Experience romantic ambiance in our  Seminyak honeymoon villa that ready to pamper you and your loved one. Enjoy the personalized service from our team and signature Nyuh amenities for your memorable honeymoon."
            imageSrc="https://nyuhbalivillas.com/wp-content/uploads/2023/03/home-seminyak.webp"
            href="/seminyak"
          />
          <PropertyPanel
            headingLevel="h2"
            name="UBUD"
            description="A sanctuary for relaxation and wellness, our Ubud resort is an ideal journey to recharge your body and mind. We invite you to experience our luxury retreat in Ubud to find tranquility, balance, and inner peace."
            imageSrc="https://nyuhbalivillas.com/wp-content/uploads/2025/01/home-ubud-compress.webp"
            href="/ubud"
          />
        </Container>
      </main>

      <HomeFooter />
      <BookNowRibbon href={GROUP_BOOKING_HREF} />
    </>
  );
}
