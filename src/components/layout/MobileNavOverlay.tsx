import Link from "next/link";

export type MobileNavLink = {
  label: string;
  href: string;
  /** Defaults to true. Set false to render this entry as plain
   * non-clickable text instead of a Link — see PropertyNavItem's `inScope`
   * for why some nav destinations aren't real links in this project. */
  inScope?: boolean;
};

type MobileNavOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  links: MobileNavLink[];
};

/**
 * The full-screen dark menu used by both the homepage header/footer and the
 * property-site headers — confirmed by actually triggering the live site's
 * hamburger rather than assuming: it's a fixed, full-viewport, dark overlay
 * with the nav links stacked and centered, not a small dropdown.
 *
 * Originally this lived only in `components/home/`, built just for the
 * homepage's two-link header. Once the property pages turned out to need
 * the identical full-screen treatment (just with more links, some of them
 * inert), it was promoted here to `components/layout/` and generalized to
 * take a `links` prop instead of a hard-coded list — reuse justified by two
 * confirmed call sites, not speculative "might need it later" reuse.
 */
export function MobileNavOverlay({
  isOpen,
  onClose,
  links,
}: MobileNavOverlayProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <nav className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-ink">
      <ul className="w-full">
        {links.map((link) => (
          <li key={link.label}>
            {link.inScope === false ? (
              <span className="flex h-12 items-center justify-center text-[15px] text-[#dddddd] uppercase">
                {link.label}
              </span>
            ) : (
              <Link
                href={link.href}
                onClick={onClose}
                className="flex h-12 items-center justify-center text-[15px] text-[#dddddd] uppercase"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
