import type { NextConfig } from "next";

// Per the project brief, this clone hotlinks Nyuh Bali Villas' own existing
// photo assets instead of downloading and re-hosting copies. next/image
// refuses to optimize an image from a host it doesn't recognize (this stops
// it being used as a free proxy for arbitrary third-party images), so every
// external hostname we reference with <Image> has to be allow-listed here
// via `remotePatterns`. `pathname` is scoped to the WordPress uploads folder
// specifically, rather than "allow everything on this domain", to keep the
// allow-list as narrow as the source actually requires.
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nyuhbalivillas.com",
        pathname: "/wp-content/uploads/**",
      },
      // The Instagram grid on /seminyak. Behold re-encodes each post to WebP
      // and serves it from its own CDN rather than passing Instagram's URLs
      // through — which is what makes these safe to prerender at all:
      // Instagram's own CDN links are signed and expire within days, so a
      // statically generated page holding them would rot. Both hostnames
      // appear in Behold's payloads. `pathname` stays open because that CDN
      // keys by content hash, so there is no stable prefix to scope to the way
      // the uploads folder gives one above.
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
};

export default nextConfig;
