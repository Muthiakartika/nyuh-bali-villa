import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { buttonClassName } from "@/components/ui/Button";
import { AboutNarrative } from "@/components/property/AboutNarrative";
import { AmenityGrid } from "@/components/property/AmenityGrid";
import { ContactPanel } from "@/components/property/ContactPanel";
import { AwardsRow } from "@/components/property/AwardsRow";
import { BookingWidget } from "@/components/property/BookingWidget";
import { DirectBookingDeals } from "@/components/property/DirectBookingDeals";
import { FaqList } from "@/components/property/FaqList";
import { ImageGallery } from "@/components/property/ImageGallery";
import { InquiryForm } from "@/components/property/InquiryForm";
import { InstagramTeaser } from "@/components/property/InstagramTeaser";
import { LinkCardGrid } from "@/components/property/LinkCardGrid";
import { PackageList } from "@/components/property/PackageList";
import { ProgramList } from "@/components/property/ProgramList";
import { ProseBand } from "@/components/property/ProseBand";
import { PropertyHero } from "@/components/property/PropertyHero";
import { RoomList } from "@/components/property/RoomList";
import { TreatmentList } from "@/components/property/TreatmentList";
import SanityPortableText from "@/components/sanity/SanityPortableText";
import type { PropertySite } from "@/data/properties";
import type { InquiryField } from "@/components/property/InquiryForm";
import type { PackageItem } from "@/components/property/PackageList";
import { resolveImageUrl, resolveImageUrls } from "@/sanity/lib/image";
import type { PortableTextBlock } from "@portabletext/types";
import type { SanityLink, SanitySection } from "@/sanity/types";

/**
 * One renderer per page-builder section.
 *
 * Each maps onto a component the site already has, so a CMS page and a
 * hand-written route produce the same markup. Nothing here invents layout:
 * where a section needs a shell, it uses `Section` + `SectionHeading` exactly
 * as the routes do.
 */

type Narrow<T extends SanitySection["_type"]> = Extract<SanitySection, { _type: T }>;

/** A link the editor marked out of scope renders as inert text, per the site's convention. */
function ActionLink({ action }: { action: SanityLink }) {
  const className = buttonClassName(action.variant ?? "solid");
  if (action.inScope === false) {
    return <span className={`${className} pointer-events-none opacity-60`}>{action.label}</span>;
  }
  if (action.external || /^(https?:\/\/|mailto:|tel:)/.test(action.href)) {
    return (
      <a href={action.href} target="_blank" rel="noreferrer" className={className}>
        {action.label}
      </a>
    );
  }
  return (
    <Link href={action.href} className={className}>
      {action.label}
    </Link>
  );
}

export function HeroBlock({ section }: { section: Narrow<"heroSection"> }) {
  const images = resolveImageUrls(section.images);
  if (!images.length) return null;
  return (
    <PropertyHero
      images={images}
      alt={section.alt || section.title}
      eyebrow={section.eyebrow ?? ""}
      title={section.title}
    />
  );
}

/**
 * The About band, rendered through the site's own `AboutNarrative` so a
 * CMS-authored About page is byte-identical to the hand-written one.
 *
 * The booking link and the contact email come from the property, not the
 * section: they are the same values the header CTA and the footer use, and a
 * page that could set them separately is a page that can drift from them.
 */
export function AboutNarrativeBlock({
  section,
  site,
}: {
  section: Narrow<"aboutNarrativeSection">;
  site: PropertySite;
}) {
  return (
    <AboutNarrative
      eyebrow={section.eyebrow ?? ""}
      heading={section.heading}
      paragraphs={section.paragraphs}
      tagline={section.tagline}
      bookingHref={site.bookingHref}
      buttonLabel={section.buttonLabel}
      promoCode={section.promoCode}
      perks={section.perks ?? []}
      contactEmail={site.contact.email}
      imageSrc={resolveImageUrl(section.image) ?? undefined}
    />
  );
}

export function ContactBlock({
  section,
  site,
}: {
  section: Narrow<"contactSection">;
  site: PropertySite;
}) {
  const image = resolveImageUrl(section.image);
  if (!image) return null;
  return (
    <ContactPanel
      eyebrow={section.eyebrow ?? site.label}
      heading={section.heading}
      intro={section.intro}
      imageSrc={image}
      imageAlt={section.image?.alt ?? site.label}
      anchor={section.anchor}
    />
  );
}

export function RoomListBlock({
  section,
  site,
}: {
  section: Narrow<"roomListSection">;
  site: PropertySite;
}) {
  const rooms = section.rooms.map((room) => ({
    name: room.name,
    images: resolveImageUrls(room.images),
    bed: room.bed ?? "",
    size: room.size ?? "",
    occupancy: room.occupancy ?? "",
    // The property's own booking URL, never a field: this is the same link the
    // header CTA and every other "Check Rates" on the site use.
    ratesHref: site.bookingHref,
    detailsHref: room.detailsHref ?? "",
    detailsInScope: room.detailsInScope ?? true,
  }));
  if (!rooms.length) return null;
  return (
    <RoomList
      eyebrow={section.eyebrow}
      heading={section.heading}
      intro={section.intro}
      tone={section.tone}
      rooms={rooms}
    />
  );
}

export function ProseBlock({
  section,
  site,
}: {
  section: Narrow<"proseSection">;
  site: PropertySite;
}) {
  return (
    <ProseBand
      eyebrow={section.eyebrow}
      heading={section.heading}
      paragraphs={section.paragraphs}
      // The address comes from the property, never from the section — the same
      // rule `ContactPanel` and `AboutNarrative` follow.
      email={site.contact.email}
      tone={section.tone}
      anchor={section.anchor}
    />
  );
}

export function RichTextBlock({ section }: { section: Narrow<"richTextSection"> }) {
  return (
    <Section tone={section.tone} width="read" id={section.anchor}>
      {section.heading ? (
        <Reveal>
          <SectionHeading eyebrow={section.eyebrow} title={section.heading} />
        </Reveal>
      ) : null}
      <Reveal>
        <div className={section.heading ? "mt-8 md:mt-10" : ""}>
          <SanityPortableText value={section.body as PortableTextBlock[]} />
        </div>
      </Reveal>
    </Section>
  );
}

export function SplitContentBlock({ section }: { section: Narrow<"splitContentSection"> }) {
  const image = resolveImageUrl(section.image);
  const imageFirst = section.imageSide === "left";
  return (
    <Section tone={section.tone} id={section.anchor}>
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <Reveal className={imageFirst ? "lg:order-2" : undefined}>
          <SectionHeading eyebrow={section.eyebrow} title={section.heading} />
          <div className="mt-8 flex flex-col gap-5 md:mt-10">
            {section.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-[17px] leading-[1.85] font-light text-pretty text-text md:text-[19px]"
              >
                {paragraph}
              </p>
            ))}
          </div>
          {section.script ? (
            <p className="font-script mt-6 text-[26px] leading-tight text-primary-deep md:text-[30px]">
              {section.script}
            </p>
          ) : null}
          {section.action ? (
            <div className="mt-8">
              <ActionLink action={section.action} />
            </div>
          ) : null}
        </Reveal>
        {image ? (
          <Reveal className={imageFirst ? "lg:order-1" : undefined}>
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={image}
                alt={section.image?.alt ?? section.heading}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        ) : null}
      </div>
    </Section>
  );
}

export function GalleryBlock({ section }: { section: Narrow<"gallerySection"> }) {
  const images = resolveImageUrls(section.images);
  if (!images.length) return null;
  return (
    <Section tone={section.tone} id={section.anchor}>
      {section.heading ? (
        <Reveal>
          <SectionHeading eyebrow={section.eyebrow} title={section.heading} />
        </Reveal>
      ) : null}
      <Reveal>
        <div className={section.heading ? "mt-8 md:mt-10" : ""}>
          <ImageGallery
            images={images}
            alt={section.alt || section.heading || "Gallery"}
            heightClassName="h-72 md:h-[28rem]"
            sizes="(min-width: 1280px) 1240px, 100vw"
          />
        </div>
      </Reveal>
    </Section>
  );
}

export function AmenityBlock({ section }: { section: Narrow<"amenityGridSection"> }) {
  return (
    <Section tone={section.tone} id={section.anchor}>
      <AmenityGrid heading={section.heading} amenities={section.amenities} />
    </Section>
  );
}

export function LinkCardGridBlock({ section }: { section: Narrow<"linkCardGridSection"> }) {
  const items = section.items.flatMap((item) => {
    const imgSrc = resolveImageUrl(item.image, 900);
    if (!imgSrc) return [];
    return [{ label: item.label, href: item.href, imgSrc, inScope: item.inScope }];
  });
  if (!items.length) return null;
  return (
    <LinkCardGrid
      eyebrow={section.eyebrow}
      heading={section.heading}
      items={items}
      columns={section.columns}
      tone={section.tone}
    />
  );
}

/** Inline packages, or a referenced set so one edit lands on every page using it. */
export function PackageListBlock({ section }: { section: Narrow<"packageListSection"> }) {
  const source =
    section.source === "reference" ? section.packageSet?.packages : section.packages;
  const always = section.source === "reference" ? (section.packageSet?.alwaysIncluded ?? []) : [];

  const packages: PackageItem[] = (source ?? []).map((item) => ({
    name: item.name,
    images: resolveImageUrls(item.images, 900),
    description: item.description,
    benefitsHeading: item.benefitsHeading,
    benefits: [...(item.benefits ?? []), ...always],
    meta: item.meta,
    notes: item.notes,
    ctas: item.ctas?.map((cta) => ({
      label: cta.label,
      href: cta.href,
      external: cta.external,
      inScope: cta.inScope,
      variant: cta.variant,
    })),
  }));
  if (!packages.length) return null;

  return (
    <PackageList
      eyebrow={section.eyebrow}
      heading={section.heading ?? ""}
      intro={section.intro}
      packages={packages}
      tone={section.tone}
    />
  );
}

export function ProgramListBlock({ section }: { section: Narrow<"programListSection"> }) {
  return <ProgramList heading={section.heading} tiers={section.tiers} tone={section.tone} />;
}

export function TreatmentListBlock({ section }: { section: Narrow<"treatmentListSection"> }) {
  const categories = section.categories.map((category) => ({
    name: category.name,
    image: resolveImageUrl(category.image, 900) ?? undefined,
    treatments: category.treatments,
  }));
  return (
    <TreatmentList
      eyebrow={section.eyebrow}
      heading={section.heading}
      intro={section.intro}
      notes={section.notes}
      categories={categories}
      cta={section.cta ? { label: section.cta.label, href: section.cta.href } : undefined}
      tone={section.tone}
    />
  );
}

export function BulletListBlock({ section }: { section: Narrow<"bulletListSection"> }) {
  return (
    <Section tone={section.tone} id={section.anchor}>
      {section.heading ? (
        <Reveal>
          <SectionHeading eyebrow={section.eyebrow} title={section.heading} />
        </Reveal>
      ) : null}
      {section.intro ? (
        <Reveal>
          <p className="mt-8 text-[17px] leading-[1.85] font-light text-pretty text-text md:mt-10 md:text-[19px]">
            {section.intro}
          </p>
        </Reveal>
      ) : null}
      <div className="mt-8 grid gap-10 md:mt-10 md:grid-cols-2">
        {section.groups.map((group, index) => (
          <Reveal key={index}>
            {group.heading ? (
              <h3 className="font-heading text-[20px] leading-[1.3] font-light text-ink md:text-[23px]">
                {group.heading}
              </h3>
            ) : null}
            <ul className={`flex flex-col gap-3 ${group.heading ? "mt-5" : ""}`}>
              {group.items.map((item, i) => (
                <li
                  key={i}
                  className="grid grid-cols-[1.5rem_1fr] text-[17px] leading-[1.85] font-light text-text md:text-[19px]"
                >
                  <span aria-hidden className="mt-[0.85em] block h-px w-3.5 bg-primary" />
                  <span className="break-words text-pretty">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/**
 * A rate table, set as a real `<table>` for the same reason `PostBody` does:
 * the money column has to stay readable against its own row.
 */
export function PriceTableBlock({ section }: { section: Narrow<"priceTableSection"> }) {
  const { columns, rows } = section.table;
  return (
    <Section tone={section.tone} id={section.anchor}>
      {section.heading ? (
        <Reveal>
          <SectionHeading title={section.heading} />
        </Reveal>
      ) : null}
      <Reveal>
        <div className={`overflow-x-auto ${section.heading ? "mt-8 md:mt-10" : ""}`}>
          <table className="w-full min-w-[20rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-ink/15">
                {columns.map((column, index) => (
                  <th
                    key={column}
                    scope="col"
                    className={`text-eyebrow font-body pb-3 font-normal text-primary-deep uppercase ${
                      index === columns.length - 1 ? "text-right" : ""
                    }`}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-ink/10">
                  {row.cells.map((cell, index) => {
                    const isLast = index === columns.length - 1;
                    return (
                      <td
                        key={index}
                        className={`py-3 text-[15px] leading-snug font-light md:text-[16px] ${
                          isLast
                            ? "pl-4 text-right font-normal whitespace-nowrap text-ink"
                            : index === 0
                              ? "pr-4 text-ink"
                              : "pr-4 text-text"
                        }`}
                      >
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </Section>
  );
}

export function FaqBlock({ section }: { section: Narrow<"faqSection"> }) {
  return <FaqList heading={section.heading} faqs={section.faqs} tone={section.tone} />;
}

export function CtaBlock({ section }: { section: Narrow<"ctaSection"> }) {
  const image = resolveImageUrl(section.image);
  return (
    <Section tone={section.tone} id={section.anchor} className={image ? "relative" : undefined}>
      {image ? (
        <>
          <Image
            src={image}
            alt={section.image?.alt ?? ""}
            fill
            sizes="100vw"
            className="-z-10 object-cover"
          />
          <div aria-hidden className="absolute inset-0 -z-10 bg-ink/55" />
        </>
      ) : null}
      <Reveal className="mx-auto max-w-2xl text-center">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.heading}
          align="center"
          surface={image ? "dark" : "light"}
        />
        {section.body ? (
          <p
            className={`mt-6 text-[17px] leading-[1.85] font-light text-pretty md:text-[19px] ${
              image ? "text-white/85" : "text-text"
            }`}
          >
            {section.body}
          </p>
        ) : null}
        {section.actions?.length ? (
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {section.actions.map((action, index) => (
              <ActionLink key={index} action={action} />
            ))}
          </div>
        ) : null}
      </Reveal>
    </Section>
  );
}

export function InquiryFormBlock({ section }: { section: Narrow<"inquiryFormSection"> }) {
  const fields = section.fields.map(
    (field) =>
      ({
        kind: field.kind,
        name: field.name,
        label: field.label,
        required: field.required,
        ...(field.options?.length ? { options: field.options } : {}),
      }) as InquiryField,
  );
  return (
    <Section tone={section.tone} width="narrow" id={section.anchor}>
      <InquiryForm
        heading={section.heading}
        fields={fields}
        submitLabel={section.submitLabel}
        confirmation={section.confirmation}
      />
    </Section>
  );
}

export function AwardsBlock({ section }: { section: Narrow<"awardsSection"> }) {
  const badges = resolveImageUrls(section.badges, 400);
  if (!badges.length) return null;
  return <AwardsRow badges={badges} variant={section.variant} />;
}

/** The three sections below fall back to the page's own property when left empty. */
export function DealsBlock({
  section,
  site,
}: {
  section: Narrow<"dealsSection">;
  site: PropertySite;
}) {
  return <DirectBookingDeals bookingHref={section.bookingHref || site.bookingHref} />;
}

export function InstagramBlock({
  section,
  site,
}: {
  section: Narrow<"instagramSection">;
  site: PropertySite;
}) {
  // The live grid, not just the heading and the Follow button: the proxy path
  // is derived from the property, exactly as the hand-written routes derive
  // it, so a CMS-authored page keeps the feed instead of quietly losing it.
  return (
    <InstagramTeaser
      heading={section.heading || "Follow Us"}
      instagramHref={site.social.instagram}
      feedEndpoint={`/api/instagram/${site.slug}`}
      feedLimit={9}
    />
  );
}

export function BookingWidgetBlock({
  section,
  site,
}: {
  section: Narrow<"bookingWidgetSection">;
  site: PropertySite;
}) {
  // The widget is keyed to a property token, so an override replaces just that.
  const scoped = section.widgetId
    ? { ...site, bookingWidgetId: section.widgetId }
    : site;
  return <BookingWidget site={scoped} />;
}
