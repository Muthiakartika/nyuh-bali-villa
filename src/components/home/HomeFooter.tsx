import Link from "next/link";
import { PROPERTIES } from "@/data/properties";
import { Container } from "@/components/ui/Container";

/**
 * The homepage's closing line: copyright left, the same two property links
 * right.
 *
 * Like HomeHeader this now floats over the photography rather than sitting on
 * a dark bar of its own, so the landing page is one uninterrupted image split
 * from edge to edge with the chrome laid quietly on top.
 *
 * It also stopped being a Client Component. The old version carried its own
 * `useState` and its own hamburger opening a second copy of the full-screen
 * menu — a duplicate of the header's, four inches below it. Two identical
 * menus on one screen is not a feature, so the footer's was removed and this
 * became a plain Server Component with no JavaScript at all.
 */
export function HomeFooter() {
  return (
    // Shallow `py` on purpose: the nav links carry their own `py-2` for tap
    // size, so the bar's padding was double-counting it and eating into the
    // clearance PropertyPanel's `pb-28` reserves for this footer.
    <footer className="absolute inset-x-0 bottom-0 z-[150] px-5 py-3 sm:px-8 md:py-5">
      <Container className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-white/60">Copyright © Nyuh Bali Villas</p>

        <nav>
          <ul className="flex gap-7">
            {PROPERTIES.map((property) => (
              <li key={property.slug}>
                <Link
                  href={property.href}
                  className="inline-block py-2 text-[11px] tracking-[0.2em] text-white/70 uppercase transition-colors duration-300 hover:text-primary"
                >
                  {property.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </footer>
  );
}
