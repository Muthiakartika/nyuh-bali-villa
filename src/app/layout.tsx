import type { Metadata } from "next";
import { Open_Sans, Source_Sans_3, Dancing_Script } from "next/font/google";
import { seo, SITE_ORIGIN } from "@/data/seo";
import SanityRuntime from "@/components/sanity/SanityRuntime";
import { resolveSiteMetadata } from "@/sanity/lib/metadata";
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

// A handwriting face for the one place the site quotes someone speaking
// rather than stating brand copy — Seminyak's "We serve with smile and
// sincerity" tagline. Everywhere else stays on the two faces above; see
// `font-script` in globals.css and its one use in AboutNarrative.
const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-dancing-script",
});

// The site-wide fallback. Next.js reads this exported object once per route
// and writes the head tags itself — there is no manual <head> markup anywhere
// in this app.
//
// **Every one of the 74 routes states its own** title and description, from
// `src/data/seo.ts`, copied per path from the live site — Home included, which
// resolves `seo("/")` in its own `generateMetadata`. So what is left here
// reaches only the pages that have no entry to state: Next's `/_not-found` and
// `/_global-error`. Keep it in step with `ROUTE_SEO["/"]` anyway; a 404 with
// the site's name in the tab is worth more than an empty one.
//
// **Only the title and description are taken from `seo("/")`, not the whole
// object.** It also returns a canonical of `/` and an `og:url` of `/`, and
// those are the homepage's, not the site's — inherited here they would have
// the 404 page declaring itself a copy of the landing page. Nothing is lost by
// leaving them out: every content route sets both itself.
const home = seo("/");

const SITE_METADATA: Metadata = {
  title: home.title,
  description: home.description,
  // Every canonical and `og:url` in this app is written as a path
  // (`alternates.canonical: "/ubud/villa"`), and this is what Next resolves
  // them against. Without it those tags would come out relative to
  // `localhost:3000` — the value Next assumes when none is given — and the
  // build would say so once and then ship it.
  metadataBase: new URL(SITE_ORIGIN),
  // One value for the whole site, stated once. Next merges metadata field by
  // field, so every route that does not mention `twitter` inherits this;
  // `seo()` deliberately sets only `openGraph`, leaving this in place. It is
  // what the live site sends on every page, and it is what makes a shared link
  // render as a wide card rather than a one-line summary.
  twitter: { card: "summary_large_image" },
  icons: {
    // Served from public/uploads/, like every other image and menu file in
    // this project now that WordPress is being switched off — see the note in
    // next.config.ts. The path keeps WordPress's own /YYYY/MM/ layout.
    icon: "/uploads/2023/10/cropped-Nyuh-Resort-Favicon-32x32.jpg",
  },
};

/**
 * The same object, with Site settings laid over it where that document fills
 * a field in.
 *
 * It is a function rather than the exported constant because reading Sanity
 * is async; unpublished or unconfigured, `resolveSiteMetadata` hands back
 * `SITE_METADATA` untouched, so this emits exactly what the constant above
 * emits until someone edits the document.
 */
export async function generateMetadata(): Promise<Metadata> {
  return resolveSiteMetadata(SITE_METADATA);
}

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
    <html
      lang="en"
      className={`${openSans.variable} ${sourceSans.variable} ${dancingScript.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        {children}
        <SanityRuntime />
      </body>
    </html>
  );
}
