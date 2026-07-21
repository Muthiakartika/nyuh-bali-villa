import Link from "next/link";
import { PROPERTIES } from "@/data/properties";
import { Container } from "@/components/ui/Container";

/**
 * The homepage's closing line: copyright left, the two property links right.
 *
 * Floats over the photography rather than sitting on a bar of its own, so the
 * landing page reads as one uninterrupted image split with the chrome laid
 * quietly on top.
 *
 * A plain Server Component. The previous version carried its own `useState` and
 * its own hamburger opening a second copy of the same full-screen menu, four
 * inches below the header's — two identical menus on one screen is not a
 * feature.
 *
 * `py` is deliberately shallow: the nav links carry their own `py-2` for tap
 * size, so a taller bar would double-count it and eat into the clearance
 * PropertyPanel's `pb-28` reserves for this footer.
 */
export function HomeFooter() {
  return (
    <footer className="absolute inset-x-0 bottom-0 z-[150] px-5 py-3 sm:px-8 md:py-5">
      <Container className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-caption text-on-dark-muted">Copyright © Nyuh Bali Villas</p>

        <nav>
          <ul className="flex gap-6">
            {PROPERTIES.map((property) => (
              <li key={property.slug}>
                <Link
                  href={property.href}
                  className="inline-block py-2 text-caption text-on-dark-muted transition-colors duration-200 active:text-on-dark"
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
