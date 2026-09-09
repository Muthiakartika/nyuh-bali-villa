// ======================================================
// Route Information
// Original WordPress URL:
// /ubud/wellness/yoga/retreat
//
// Current Next.js Route:
// src/app/ubud/wellness/yoga/retreat/page.tsx
//
// Post ini berada di bawah /ubud/wellness/yoga/, jadi ia route STATIS yang
// menang atas catch-all [...class]. Folder `yoga` sengaja tidak punya
// page.tsx sendiri, sehingga /ubud/wellness/yoga tetap jatuh ke catch-all.
//
// Jika slug berubah: ubah `path` di src/data/posts.ts dan rename folder ini.
// ======================================================

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostPage, findPost } from "@/components/property/PostPage";
import { resolveDocumentMetadata } from "@/sanity/lib/metadata";

const PATH = "/ubud/wellness/yoga/retreat";

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
