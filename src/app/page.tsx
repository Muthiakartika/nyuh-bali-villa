import { HomeHeader } from "@/components/home/HomeHeader";
import { HomeFooter } from "@/components/home/HomeFooter";
import { PropertyPanel } from "@/components/home/PropertyPanel";
import { BookNowRibbon } from "@/components/layout/BookNowRibbon";

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

      <main className="flex flex-col px-5 md:flex-row md:px-[92px]">
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
      </main>

      <HomeFooter />
      <BookNowRibbon href={GROUP_BOOKING_HREF} />
    </>
  );
}
