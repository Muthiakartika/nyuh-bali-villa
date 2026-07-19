import type { Metadata } from "next";
import { Open_Sans, Source_Sans_3 } from "next/font/google";
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
    <html lang="en" className={`${openSans.variable} ${sourceSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
