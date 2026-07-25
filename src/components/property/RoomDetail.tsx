import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ImageGallery } from "@/components/property/ImageGallery";
import type { RoomDetail as RoomDetailData } from "@/data/rooms";
import type { PropertySite } from "@/data/properties";

type RoomDetailBodyProps = {
  room: RoomDetailData;
  site: PropertySite;
};

/**
 * The body of a room/villa detail page — the ten live detail pages all run
 * this one Oxygen template, so they get one component and differ only by the
 * data in `data/rooms.ts`.
 *
 * Section order matches the live page exactly: the pitch and Check Rates, the
 * photo gallery, the Details table, then Amenities & Facilities.
 *
 * The Details block is a `<dl>` on a two-column grid at `lg` — label/value
 * pairs really are a description list, and the pattern matches the spec rows
 * already used by `RoomList` on the listing pages.
 */
export function RoomDetailBody({ room, site }: RoomDetailBodyProps) {
  return (
    <>
      <Section tone="sand">
        <SectionHeading eyebrow={site.label} title={room.title} />
        <Reveal delay={80}>
          <p className="mt-8 max-w-[62rem] text-[17px] leading-[1.7] font-light text-text">
            {room.description}
          </p>
          <div className="mt-8">
            <Button href={site.bookingHref} external>
              Check Rates
            </Button>
          </div>
        </Reveal>
      </Section>

      <Section tone="sand-deep">
        <SectionHeading title="Gallery" />
        <Reveal delay={80} className="mt-8 md:mt-10">
          <ImageGallery
            images={room.gallery}
            alt={room.title}
            heightClassName="h-64 sm:h-80 md:h-[30rem]"
            sizes="(min-width: 1240px) 1240px, 100vw"
            priority
          />
        </Reveal>
      </Section>

      <Section tone="sand">
        <SectionHeading title="Details" />
        <Reveal delay={80}>
          <dl className="mt-8 grid gap-x-12 border-t border-ink/10 md:mt-10 lg:grid-cols-2">
            {room.details.map((row) => (
              <div
                key={row.label}
                className="flex flex-col gap-1 border-b border-ink/10 py-4 sm:flex-row sm:gap-6"
              >
                <dt className="text-eyebrow font-body shrink-0 pt-1 text-primary-deep uppercase sm:w-52">
                  {row.label}
                </dt>
                <dd className="text-[16px] leading-relaxed font-light text-text">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Section>

      <Section tone="sand-deep">
        <SectionHeading title="Amenities & Facilities" />
        {/* Two independent lists, side by side at `lg` and stacked below —
            the same `lg` rule every other split on this site follows. */}
        <div className="mt-8 grid gap-x-14 gap-y-10 md:mt-10 lg:grid-cols-2">
          {[
            { heading: "Amenities", items: room.amenities },
            { heading: "Facilities", items: room.facilities },
          ].map((group, index) =>
            group.items.length ? (
              <Reveal key={group.heading} delay={index * 90}>
                <h3 className="text-eyebrow font-body text-primary-deep uppercase">
                  {group.heading}
                </h3>
                <ul className="mt-4 flex flex-col divide-y divide-ink/10 border-y border-ink/10">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="py-2.5 text-[15px] leading-relaxed font-light text-text"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null,
          )}
        </div>
      </Section>
    </>
  );
}
