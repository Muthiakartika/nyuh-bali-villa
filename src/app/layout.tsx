import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// DESIGN.md specifies a single family — Roobert PRO — at every step of the
// type ramp. Roobert PRO is a commercial face from Displaay and cannot be
// licensed or self-hosted from here, so Plus Jakarta Sans stands in for it:
// the same geometric-humanist construction, and it carries the 500 weight the
// ramp uses at almost every level. Replacing it with the real face later means
// changing this loader and the `--font-*` block in globals.css, nothing else.
//
// One family replaces the previous two (Open Sans body / Source Sans headings),
// which matches how DESIGN.md is written — it never splits display from body.
//
// The `variable` option exposes the font as a CSS custom property rather than a
// fixed className. That indirection is what lets globals.css's `@theme inline`
// block turn it into ordinary Tailwind utilities usable on any element.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
});

// Metadata copied verbatim from the live site's <title>/<meta name="description">
// so search engines and browser tabs match the original. Next.js reads this
// exported object once per route and writes the corresponding <head> tags
// itself — there's no manual <head> markup anywhere in this app.
export const metadata: Metadata = {
  title: "Nyuh Bali Villas & Resort - 5 Star Luxury Bali Villa",
  description:
    "Indulge in romantic ambiance at our Seminyak honeymoon villas. Unwind in our Ubud resort, a retreat for luxury yoga, inner peace and wellness.",
  icons: {
    // Hotlinked, like every other image in this project — see next.config.ts.
    icon: "https://nyuhbalivillas.com/wp-content/uploads/2023/10/cropped-Nyuh-Resort-Favicon-32x32.jpg",
  },
};

// The Root Layout is the one file every route in the App Router shares —
// anything rendered here (fonts, <html>/<body> tags) wraps every page
// automatically, which is why the font variables and global stylesheet are
// wired up here instead of in each individual page.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // `min-h-screen` + `flex flex-col` is the classic sticky-footer setup:
    // every page renders <header>, <main> and <footer> as siblings here, so
    // making the body a full-height column lets the <main> stretch (via
    // `flex-1` on the page itself) and pushes the footer to the bottom of the
    // screen. Without this, a short page like the homepage left a band of
    // empty white below the footer.
    <html lang="en" className={jakarta.variable}>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
