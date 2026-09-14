// `remotePatterns` is next/image's allow-list: it refuses to optimize an image
// from a host it doesn't recognise, which stops the optimizer being used as a
// free proxy for arbitrary third-party images.
//
// **nyuhbalivillas.com is deliberately NOT on it any more.** Every photograph
// and menu PDF used to be hotlinked from its /wp-content/uploads/; all 287 are
// now downloaded into public/uploads/ under WordPress's own /YYYY/MM/ layout,
// because WordPress is being switched off and this build replaces it. Leaving
// the host allow-listed would let a stray absolute URL keep working right up
// until that happens and then fail silently, on whichever page nobody opened
// that week. With it gone, such a URL fails loudly the first time it renders,
// which is the failure this project can act on. Anything in the CMS still
// holding an old URL is rewritten on read — see src/sanity/lib/uploads.ts.
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // The Instagram grid on /seminyak. Behold re-encodes each post to WebP
      // and serves it from its own CDN rather than passing Instagram's URLs
      // through — which is what makes these safe to prerender at all:
      // Instagram's own CDN links are signed and expire within days, so a
      // statically generated page holding them would rot. Both hostnames
      // appear in Behold's payloads. `pathname` stays open because that CDN
      // keys by content hash, so there is no stable prefix to scope it to.
      {
        protocol: "https",
        hostname: "cdn.behold.pictures",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "behold.pictures",
        pathname: "/**",
      },
      // Sanity's image pipeline, for anything an editor uploads rather than
      // hotlinks. Scoped to the image asset path rather than the whole host,
      // for the same reason the uploads folder above is scoped: keeping the
      // allow-list as narrow as what is actually referenced.
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },

  // The Studio must not be indexed, and robots.txt alone cannot promise that.
  // `Disallow: /studio` stops a well-behaved crawler fetching the page; it does
  // not stop the URL itself being listed if someone links to it, because a
  // crawler that is refused the page never reads the `noindex` inside it. This
  // header is the half that survives that case, and being a header it also
  // covers the Studio's own asset responses rather than only its HTML. Both
  // halves are kept: the disallow saves the crawl, this saves the index.
  //
  // Cloudflare bypasses its cache for `/studio*` (scripts/cloudflare/
  // cache-rules.mjs), so there is no edge copy that could be serving these
  // pages without the header.
  async headers() {
    return [
      {
        source: "/studio/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/studio",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },

  // Two sets, both about the day this build replaces the live site: URLs
  // WordPress publishes today that nothing here would answer. A 308 keeps the
  // ranking signals a page has accumulated; a 404 throws them away.
  //
  // **Every destination is a route this build already serves, and every source
  // is a URL the live site actually publishes.** Both lists were derived, not
  // guessed: the sources come from WordPress's own page and post index
  // (`/wp-json/wp/v2/pages` and `/posts`, 83 published paths) diffed against
  // `ROUTE_SEO`, and the destinations are the successors this project already
  // recorded. Re-run that diff after any WordPress restructuring — it is the
  // only way these can be found, because a page missing from the build is
  // invisible from inside the build.
  async redirects() {
    return [
      // Yoast served the sitemap as an index of two files at three URLs. Google
      // has been fetching those for years and a Search Console property still
      // names one of them, so they redirect to Next's single `/sitemap.xml`
      // instead of becoming three 404s. Permanent, because they are not coming
      // back.
      {
        source: "/sitemap_index.xml",
        destination: "/sitemap.xml",
        permanent: true,
      },
      {
        source: "/page-sitemap.xml",
        destination: "/sitemap.xml",
        permanent: true,
      },
      {
        source: "/post-sitemap.xml",
        destination: "/sitemap.xml",
        permanent: true,
      },

      // The five superseded duplicates. Each is a page WordPress still serves
      // at an old URL while the content itself moved to one of the 74 routes
      // here, which is why this project does not rebuild them — see the list of
      // deliberate omissions in CLAUDE.md.
      //
      // The first two need no judgement at all: the live page's `<title>` is
      // byte-identical to the destination's entry in `src/data/seo.ts`, so
      // WordPress is publishing one page at two URLs and this simply picks the
      // one that survived.
      {
        // "Honeymoon Suite Pool Villa - Seminyak", both of them.
        source: "/seminyak-honeymoon",
        destination: "/seminyak/villa/honeymoon",
        permanent: true,
      },
      {
        // "Luxury Spa in Ubud", both of them. The "medical aesthetic" half of
        // the old title is a separate business on its own domain now, which is
        // what `PropertyNavChild.external` marks in the Ubud menu.
        source: "/ubud-spa-and-medical-aesthetic",
        destination: "/ubud/spa",
        permanent: true,
      },
      {
        // "Ubud - Culture - Nyuh Bali" → "Ubud - Experience - Nyuh Bali": the
        // same slot in the same title template, renamed. It is the page the
        // Ubud menu's Culture item points at.
        source: "/ubud-culture",
        destination: "/ubud/balinese-culture",
        permanent: true,
      },
      {
        // Lumbini is the restaurant `/ubud/dining` is about — the page is
        // headed "Lumbini Restaurant" and nothing else here covers it.
        source: "/lumbini-restaurant",
        destination: "/ubud/dining",
        permanent: true,
      },
      {
        // A draft copy in a `/ubud-backup/` folder that Yoast listed in the
        // public sitemap — a live-site accident rather than a page. Its
        // treatment list differs from the published chakra healing page, but
        // that page is the only one this site has on the subject, and a
        // backup URL should not have been indexed in the first place.
        source: "/ubud-backup/culture/chakra-healing-retreat",
        destination: "/ubud/wellness/chakra-healing",
        permanent: true,
      },

      // Nothing here for /welcomeaboard, /ubud-directory, /seminyak-directory
      // or /suite-directory — those four are *built*, at their own URLs, so
      // the QR codes printed on the cards in every room keep resolving rather
      // than landing anywhere approximate. They are the four routes the
      // sitemap deliberately leaves out; see UNLISTED in src/app/sitemap.ts.
    ];
  },
};

export default nextConfig;
