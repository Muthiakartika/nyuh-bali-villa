import { category } from "./documents/category";
import { experience } from "./documents/experience";
import { legalPage } from "./documents/legalPage";
import { packageSet } from "./documents/packageSet";
import { page } from "./documents/page";
import { post } from "./documents/post";
import { property } from "./documents/property";
import { room } from "./documents/room";
import { siteSettings } from "./documents/siteSettings";
import { testimonial } from "./documents/testimonial";

import { amenity } from "./objects/amenity";
import {
  articleFaq,
  articleHeading,
  articleImage,
  articleList,
  articleParagraph,
  articlePointItem,
  articlePoints,
  articlePrice,
} from "./objects/articleBlocks";
import { bulletGroup } from "./objects/bulletGroup";
import { detailRow } from "./objects/detailRow";
import {
  bulletBlock,
  experienceHighlight,
  experienceProgram,
  experienceSection,
  teamMember,
} from "./objects/experienceParts";
import { faqItem } from "./objects/faqItem";
import { imageWithAlt } from "./objects/imageWithAlt";
import { link } from "./objects/link";
import { packageItem, packageMeta } from "./objects/packageItem";
import { portableText } from "./objects/portableText";
import { priceRow, priceTable } from "./objects/priceTable";
import { seo } from "./objects/seo";
import {
  treatmentCategory,
  treatmentItem,
  treatmentOption,
} from "./objects/treatmentItem";

import { aboutNarrativeSection } from "./objects/sections/aboutNarrativeSection";
import { amenityGridSection } from "./objects/sections/amenityGridSection";
import { collectionSection } from "./objects/sections/collectionSection";
import { contactSection } from "./objects/sections/contactSection";
import { ctaSection } from "./objects/sections/ctaSection";
import { faqSection } from "./objects/sections/faqSection";
import { gallerySection } from "./objects/sections/gallerySection";
import { heroSection } from "./objects/sections/heroSection";
import { inquiryFormSection } from "./objects/sections/inquiryFormSection";
import { linkCardGridSection } from "./objects/sections/linkCardGridSection";
import { packageListSection } from "./objects/sections/packageListSection";
import { programListSection } from "./objects/sections/programListSection";
import { proseSection } from "./objects/sections/proseSection";
import { richTextSection } from "./objects/sections/richTextSection";
import { roomListSection } from "./objects/sections/roomListSection";
import { splitContentSection } from "./objects/sections/splitContentSection";
import { treatmentListSection } from "./objects/sections/treatmentListSection";
import {
  awardsSection,
  bookingWidgetSection,
  bulletListSection,
  dealsSection,
  instagramSection,
  priceTableSection,
} from "./objects/sections/utilitySections";

export const schemaTypes = [
  // Shared objects
  imageWithAlt,
  link,
  portableText,
  seo,
  faqItem,
  bulletGroup,
  detailRow,
  amenity,
  priceRow,
  priceTable,
  packageMeta,
  packageItem,
  treatmentOption,
  treatmentItem,
  treatmentCategory,
  experienceSection,
  experienceHighlight,
  experienceProgram,
  teamMember,
  bulletBlock,

  // Article body blocks
  articleHeading,
  articleParagraph,
  articleList,
  articleImage,
  articlePointItem,
  articlePoints,
  articleFaq,
  articlePrice,

  // Controlled page-builder sections
  heroSection,
  aboutNarrativeSection,
  richTextSection,
  proseSection,
  splitContentSection,
  gallerySection,
  amenityGridSection,
  linkCardGridSection,
  collectionSection,
  roomListSection,
  packageListSection,
  programListSection,
  treatmentListSection,
  bulletListSection,
  priceTableSection,
  faqSection,
  ctaSection,
  inquiryFormSection,
  contactSection,
  awardsSection,
  dealsSection,
  instagramSection,
  bookingWidgetSection,

  // Documents
  page,
  post,
  category,
  room,
  experience,
  packageSet,
  testimonial,
  legalPage,
  property,
  siteSettings,
];
