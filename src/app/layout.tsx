import type { Metadata } from "next";
import { Open_Sans, Source_Sans_3 } from "next/font/google";
import { seo } from "@/data/seo";
import "./globals.css";

// The live site self-hosts two webfonts via a WordPress plugin: "Open Sans"
// for body copy and "Source Sans" (Google's current distribution of the
// former "Source Sans Pro") for headings, at weight 300 (light) as measured
// on the homepage <h1>. `next/font/google` downloads and self-hosts these at
// build time too — same visual result as the original, but without a
// render-blocking request out to Google's font CDN at runtime.
//
// Each loader's `variable` option exposes the font as a CSS custom property
// (e.g. `--font-open-sans`) instead of a fixed className. That indirection is
// what lets globals.css's `@theme inline` block turn them into ordinary
// Tailwind utilities (`font-body`, `font-heading`) usable on any element,
// rather than being stuck applying one font to one root element.
const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-open-sans",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-source-sans",
});

// The site-wide fallback, and the live homepage's own title and description.
// Next.js reads this exported object once per route and writes the head tags
// itself — there is no manual <head> markup anywhere in this app.
//
// **Every route now states its own**, from `src/data/seo.ts`, copied per path
// from the live site. What is left here matters for exactly one thing: the
// fifteen live routes that publish no description at all inherit this one
// rather than shipping none. Keep it in step with `ROUTE_SEO["/"]`.
export const metadata: Metadata = {
  ...seo("/"),
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
    <html lang="en" className={`${openSans.variable} ${sourceSans.variable}`}>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
