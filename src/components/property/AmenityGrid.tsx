import type { SVGProps } from "react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import {
  CutleryIcon,
  DumbbellIcon,
  HeartIcon,
  LeafIcon,
  StarIcon,
  UsersIcon,
  WifiIcon,
  YogaIcon,
} from "@/components/ui/icons";

/** Pages name the glyph they want rather than importing an icon component, so
 * the icon set stays an implementation detail of this row. */
export type AmenityIconName =
  | "wifi"
  | "spa"
  | "dining"
  | "romance"
  | "service"
  | "yoga"
  | "gym"
  | "class";

const ICON: Record<AmenityIconName, (props: SVGProps<SVGSVGElement>) => React.ReactElement> = {
  wifi: WifiIcon,
  spa: LeafIcon,
  dining: CutleryIcon,
  romance: HeartIcon,
  service: StarIcon,
  yoga: YogaIcon,
  gym: DumbbellIcon,
  class: UsersIcon,
};

export type Amenity = {
  icon: AmenityIconName;
  /** The live row sets each amenity over two lines ("Complimentary" / "WIFI",
   * "16-Hour" / "In Room Dining"). Items with a single word have no subtitle. */
  title: string;
  subtitle?: string;
};

type AmenityGridProps = {
  heading?: string;
  amenities: Amenity[];
  tone?: "sand" | "sand-deep";
};

/**
 * "Featured Amenities" — the icon row that closes the Villas/Stay pages on
 * both properties (Seminyak lists 5, Ubud 8).
 *
 * It sits on a light band, not the dark one the live site uses: a page body
 * here carries no `ink` section at all (see Section.tsx), and the awards base
 * plus the footer are already the page's dark landing. The gold is in the
 * glyphs, where full-strength `primary` is safe — the labels are `ink`, per the
 * heading rule.
 */
export function AmenityGrid({
  heading = "Featured Amenities",
  amenities,
  tone = "sand-deep",
}: AmenityGridProps) {
  return (
    <Section tone={tone}>
      <SectionHeading title={heading} />

      <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-9 md:mt-10 md:grid-cols-4">
        {amenities.map((amenity, index) => {
          const Icon = ICON[amenity.icon];

          return (
            <Reveal key={amenity.title + amenity.subtitle} delay={index * 70}>
              <div className="flex flex-col items-start">
                <Icon aria-hidden className="h-8 w-8 text-primary" />
                <p className="font-heading mt-4 text-[19px] leading-tight font-light text-ink">
                  {amenity.title}
                </p>
                {amenity.subtitle ? (
                  <p className="font-heading text-[19px] leading-tight font-light text-ink">
                    {amenity.subtitle}
                  </p>
                ) : null}
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
