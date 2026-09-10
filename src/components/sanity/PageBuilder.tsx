import { Fragment } from "react";
import DynamicCollectionSection from "@/components/sanity/DynamicCollectionSection";
import {
  AboutNarrativeBlock,
  AmenityBlock,
  AwardsBlock,
  BookingWidgetBlock,
  BulletListBlock,
  ContactBlock,
  CtaBlock,
  DealsBlock,
  FaqBlock,
  GalleryBlock,
  HeroBlock,
  InquiryFormBlock,
  InstagramBlock,
  LinkCardGridBlock,
  PackageListBlock,
  PriceTableBlock,
  ProgramListBlock,
  PropertyPickerBlock,
  ProseBlock,
  RichTextBlock,
  RoomListBlock,
  SplitContentBlock,
  TreatmentListBlock,
} from "@/components/sanity/ContentSections";
import type { PropertySite } from "@/data/properties";
import type { SanitySection } from "@/sanity/types";

/**
 * Renders a `page` document's ordered `sections` array.
 *
 * The switch is exhaustive over `SanitySection`, so adding a section type is
 * a compile error here until it is handled — which is the point of keeping
 * that union handwritten. An unknown `_type` arriving from a newer schema
 * than this deployment renders nothing rather than crashing the page.
 */
function renderSection(section: SanitySection, site: PropertySite) {
  switch (section._type) {
    case "heroSection":
      return <HeroBlock section={section} />;
    case "propertyPickerSection":
      return <PropertyPickerBlock section={section} />;
    case "aboutNarrativeSection":
      return <AboutNarrativeBlock section={section} site={site} />;
    case "proseSection":
      return <ProseBlock section={section} site={site} />;
    case "richTextSection":
      return <RichTextBlock section={section} />;
    case "splitContentSection":
      return <SplitContentBlock section={section} />;
    case "gallerySection":
      return <GalleryBlock section={section} />;
    case "amenityGridSection":
      return <AmenityBlock section={section} />;
    case "linkCardGridSection":
      return <LinkCardGridBlock section={section} />;
    case "collectionSection":
      return <DynamicCollectionSection section={section} site={site} />;
    case "roomListSection":
      return <RoomListBlock section={section} site={site} />;
    case "packageListSection":
      return <PackageListBlock section={section} />;
    case "programListSection":
      return <ProgramListBlock section={section} />;
    case "treatmentListSection":
      return <TreatmentListBlock section={section} />;
    case "bulletListSection":
      return <BulletListBlock section={section} />;
    case "priceTableSection":
      return <PriceTableBlock section={section} />;
    case "faqSection":
      return <FaqBlock section={section} />;
    case "ctaSection":
      return <CtaBlock section={section} />;
    case "contactSection":
      return <ContactBlock section={section} site={site} />;
    case "inquiryFormSection":
      return <InquiryFormBlock section={section} />;
    case "awardsSection":
      return <AwardsBlock section={section} />;
    case "dealsSection":
      return <DealsBlock section={section} site={site} />;
    case "instagramSection":
      return <InstagramBlock section={section} site={site} />;
    case "bookingWidgetSection":
      return <BookingWidgetBlock section={section} site={site} />;
    default:
      return null;
  }
}

export default function PageBuilder({
  sections,
  site,
}: {
  sections: SanitySection[] | undefined;
  site: PropertySite;
}) {
  const visible = (sections ?? []).filter((section) => !section.isHidden);
  return (
    <>
      {visible.map((section) => (
        <Fragment key={section._key}>{renderSection(section, site)}</Fragment>
      ))}
    </>
  );
}
