import Image from "next/image";

type AwardsRowProps = {
  /** Seminyak shows 5 badges; Ubud shows a different set of 8 — checked
   * each property's page directly rather than assuming they share one
   * fixed list. */
  badges: string[];
};

/**
 * The row of trust/award badges shown near the bottom of every property
 * page.
 */
export function AwardsRow({ badges }: AwardsRowProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 bg-ink px-5 py-10 md:px-[92px]">
      {badges.map((src) => (
        <div key={src} className="relative h-[104px] w-[100px]">
          <Image src={src} alt="Award badge" fill sizes="100px" className="object-contain" />
        </div>
      ))}
    </div>
  );
}
