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
import { seo } from "@/data/seo";

const PATH = "/ubud/wellness/yoga/retreat";
const post = findPost(PATH);

export const metadata: Metadata = seo("/ubud/wellness/yoga/retreat");

export default function StandalonePostPage() {
  if (!post) notFound();
  return <PostPage post={post} />;
}
