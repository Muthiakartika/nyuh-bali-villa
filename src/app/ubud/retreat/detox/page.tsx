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
import { seo } from "@/data/seo";

const PATH = "/ubud/retreat/detox";
const post = findPost(PATH);

export const metadata: Metadata = seo("/ubud/retreat/detox");

export default function StandalonePostPage() {
  if (!post) notFound();
  return <PostPage post={post} />;
}
