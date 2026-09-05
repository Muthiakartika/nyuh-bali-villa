// ======================================================
// Route Information
// Original WordPress URL:
// /life-coach-retreat-benefits
//
// Current Next.js Route:
// src/app/life-coach-retreat-benefits/page.tsx
//
// Legacy article URL now serves the same service as /ubud/wellness/life-coach.
//
// Keep the legacy URL and service content aligned with WordPress.
// ======================================================

import type { Metadata } from "next";
import WellnessClassPage from "@/app/ubud/wellness/[...class]/page";
import { seo } from "@/data/seo";

export const metadata: Metadata = seo("/life-coach-retreat-benefits");

export default function LifeCoachBenefitsPage() {
  // WordPress now serves the life-coach service at this legacy article URL.
  return <WellnessClassPage params={Promise.resolve({ class: ["life-coach"] })} />;
}
