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
    ],
  },
};

export default nextConfig;
