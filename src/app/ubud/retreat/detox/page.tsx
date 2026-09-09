// ======================================================
// Route Information
// Original WordPress URL:
// /ubud/retreat/detox
//
// Current Next.js Route:
// src/app/ubud/retreat/detox/page.tsx
//
// Post ini berada di bawah /ubud/retreat/, jadi ia route STATIS yang menang
// atas catch-all [...programme] di folder induknya.
//
// Jika slug berubah: ubah `path` di src/data/posts.ts dan rename folder ini.
// ======================================================

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostPage, findPost } from "@/components/property/PostPage";
import { resolveDocumentMetadata } from "@/sanity/lib/metadata";

const PATH = "/ubud/retreat/detox";

export async function generateMetadata(): Promise<Metadata> {
  // The published post's own SEO fields win; anything it leaves empty falls
  // back to the live site's title and description in src/data/seo.ts.
  return resolveDocumentMetadata(PATH, await findPost(PATH));
}

export default async function StandalonePostPage() {
  const post = await findPost(PATH);
  if (!post) notFound();
  return <PostPage post={post} />;
}
