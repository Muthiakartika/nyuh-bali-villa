import type { Metadata } from "next";
import { metadata as studioMetadata } from "next-sanity/studio";
import { isSanityConfigured } from "@/sanity/env";
import StudioClient from "./StudioClient";

export const dynamic = "force-static";

export const metadata: Metadata = {
  ...studioMetadata,
  title: "Content Studio",
  robots: { index: false, follow: false },
};

export { viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sand px-6">
        <div className="max-w-xl border-l-2 border-gold bg-white p-8 font-body text-ink">
          <h1 className="font-heading text-2xl font-light">Sanity is not configured yet</h1>
          <p className="mt-4 leading-relaxed text-ink/70">
            Add NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET to
            .env.local, then follow README-SANITY.md. The public website is still
            serving its existing content safely.
          </p>
        </div>
      </div>
    );
  }
  return <StudioClient />;
}
