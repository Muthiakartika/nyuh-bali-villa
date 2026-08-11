// ======================================================
// Route Information
// Original WordPress URL:
// /life-coach-retreat-benefits
//
// Current Next.js Route:
// src/app/life-coach-retreat-benefits/page.tsx
//
// Post top-level, tanpa prefix blog — persis seperti di WordPress.
//
// Jika slug berubah: ubah `path` di src/data/posts.ts dan rename folder ini.
// ======================================================

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostPage, findPost } from "@/components/property/PostPage";
import { seo } from "@/data/seo";

const PATH = "/life-coach-retreat-benefits";
const post = findPost(PATH);

export const metadata: Metadata = seo("/life-coach-retreat-benefits");

export default function StandalonePostPage() {
  if (!post) notFound();
  return <PostPage post={post} />;
}
