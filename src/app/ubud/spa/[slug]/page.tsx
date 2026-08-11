// ======================================================
// Route Information
// Original WordPress URLs: post blog dengan prefix /ubud/spa/
// (daftar slug dihasilkan dari POSTS di src/data/posts.ts)
//
// Current Next.js Route:
// src/app/ubud/spa/[slug]/page.tsx
//
// Kenapa prefix ini punya route sendiri: WordPress menerbitkan post di
// beberapa prefix berbeda (/ubud/spa salah satunya). Setiap prefix butuh segmen
// route-nya sendiri agar URL terbit tetap identik dengan situs live.
//
// Jika slug/prefix berubah: ubah field `path` di src/data/posts.ts, lalu
// sesuaikan nama folder route ini.
// ======================================================

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostPage, findPost } from "@/components/property/PostPage";
import { POSTS } from "@/data/posts";
import { seo } from "@/data/seo";

const PREFIX = "/ubud/spa";
const ITEMS = POSTS.filter((p) => p.path.startsWith(PREFIX + "/"));

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return ITEMS.map((p) => ({ slug: p.path.slice(PREFIX.length + 1) }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  // Title and description come from the live site, keyed by published
  // path — see src/data/seo.ts.
  return seo(`${PREFIX}/${(await params).slug}`);
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const post = findPost(`${PREFIX}/${(await params).slug}`);
  if (!post) notFound();
  return <PostPage post={post} />;
}
