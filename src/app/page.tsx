import { HomeHeader } from "@/components/home/HomeHeader";
import { HomeFooter } from "@/components/home/HomeFooter";
import { PropertyPanel } from "@/components/home/PropertyPanel";
import { BookNowRibbon } from "@/components/layout/BookNowRibbon";

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
export default function Home() {
  return (
    <div className="relative min-h-screen">
      <HomeHeader />

      {/* Gapless on purpose: the seam where the two photographs meet is the
          division, and it does the job a gutter used to do without spending
          any of the screen on empty space. */}
      <main className="grid md:grid-cols-2">
        <PropertyPanel
          headingLevel="h1"
          name="Seminyak"
          description="Experience romantic ambiance in our  Seminyak honeymoon villa that ready to pamper you and your loved one. Enjoy the personalized service from our team and signature Nyuh amenities for your memorable honeymoon."
          imageSrc="https://nyuhbalivillas.com/wp-content/uploads/2023/03/home-seminyak.webp"
          href="/seminyak"
        />
        <PropertyPanel
          headingLevel="h2"
          name="Ubud"
          description="A sanctuary for relaxation and wellness, our Ubud resort is an ideal journey to recharge your body and mind. We invite you to experience our luxury retreat in Ubud to find tranquility, balance, and inner peace."
          imageSrc="https://nyuhbalivillas.com/wp-content/uploads/2025/01/home-ubud-compress.webp"
          href="/ubud"
        />
      </main>

      <HomeFooter />
      <BookNowRibbon href={GROUP_BOOKING_HREF} />
    </div>
  );
}
