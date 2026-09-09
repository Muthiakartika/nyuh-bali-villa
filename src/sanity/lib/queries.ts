import { defineQuery } from "next-sanity";

const imageProjection = `{
  _type,
  asset,
  alt,
  caption,
  externalUrl,
  crop,
  hotspot
}`;

const seoProjection = `{
  title,
  description,
  image ${imageProjection},
  noIndex
}`;

/**
 * Sections are projected with `...` plus explicit image resolution, so a new
 * section type renders without a query change — only its images need naming.
 * `packageSet` is dereferenced here because a referenced set is the whole
 * point of the packages section (one copy, two routes).
 */
const sectionProjection = `{
  ...,
  image ${imageProjection},
  images[] ${imageProjection},
  badges[] ${imageProjection},
  items[]{
    ...,
    image ${imageProjection}
  },
  packages[]{
    ...,
    images[] ${imageProjection}
  },
  categories[]{
    ...,
    image ${imageProjection}
  },
  packageSet->{
    _id,
    title,
    alwaysIncluded,
    packages[]{
      ...,
      images[] ${imageProjection}
    }
  }
}`;

export const pageByPathQuery = defineQuery(`
  *[_type == "page" && path == $path][0]{
    _id,
    _type,
    title,
    path,
    property,
    seo ${seoProjection},
    sections[] ${sectionProjection}
  }
`);

export const allPagePathsQuery = defineQuery(`
  *[_type == "page" && defined(path)].path
`);

/**
 * Conditional per block type, not blanket.
 *
 * A flat `items[]{...}` here silently destroys `articleList`, whose `items`
 * is an array of plain strings: projecting an object out of a string yields
 * `null`, so a four-item list came back as `[null, null, null, null]` and the
 * renderer crashed on the first one. Only `articlePoints` has object items,
 * and only `articleImage` has an image, so each is projected where it applies.
 */
const articleBlockProjection = `{
  ...,
  _type == "articleImage" => {
    image ${imageProjection}
  },
  _type == "articlePoints" => {
    items[]{
      ...,
      body[]{
        ...,
        image ${imageProjection}
      }
    }
  }
}`;

const postProjection = `{
  _id,
  _type,
  title,
  path,
  property,
  date,
  order,
  excerpt,
  image ${imageProjection},
  "categories": categories[]->{_id, title, "slug": slug.current},
  blocks[] ${articleBlockProjection},
  seo ${seoProjection}
}`;

export const postByPathQuery = defineQuery(`
  *[_type == "post" && path == $path][0] ${postProjection}
`);

export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(path)] | order(date desc, order asc) ${postProjection}
`);

export const postsByPropertyQuery = defineQuery(`
  *[_type == "post" && property == $property && defined(path)] | order(date desc, order asc) ${postProjection}
`);

export const allPostPathsQuery = defineQuery(`
  *[_type == "post" && defined(path)].path
`);

const roomProjection = `{
  _id,
  _type,
  title,
  "slug": slug.current,
  property,
  description,
  details,
  amenities,
  facilities,
  hero ${imageProjection},
  gallery[] ${imageProjection},
  order,
  seo ${seoProjection}
}`;

export const allRoomsQuery = defineQuery(`
  *[_type == "room" && defined(slug.current)] | order(property asc, order asc, title asc) ${roomProjection}
`);

export const roomsByPropertyQuery = defineQuery(`
  *[_type == "room" && property == $property && defined(slug.current)] | order(order asc, title asc) ${roomProjection}
`);

const experienceProjection = `{
  _id,
  _type,
  title,
  slug,
  group,
  eyebrow,
  paragraphs,
  recommendedFor,
  note,
  sections[]{
    ...,
    image ${imageProjection}
  },
  blocks,
  programsHeading,
  programs,
  inclusions,
  price,
  highlightsHeading,
  highlights[]{
    ...,
    icon ${imageProjection}
  },
  closingCta,
  teamHeading,
  team[]{
    ...,
    photo ${imageProjection}
  },
  faqHeading,
  faq,
  hero ${imageProjection},
  gallery[] ${imageProjection},
  seo ${seoProjection}
}`;

export const allExperiencesQuery = defineQuery(`
  *[_type == "experience" && defined(slug)] | order(group asc, title asc) ${experienceProjection}
`);

export const experienceBySlugQuery = defineQuery(`
  *[_type == "experience" && slug == $slug][0] ${experienceProjection}
`);

export const allPackageSetsQuery = defineQuery(`
  *[_type == "packageSet" && defined(slug.current)]{
    _id,
    _type,
    title,
    "slug": slug.current,
    property,
    alwaysIncluded,
    packages[]{
      ...,
      images[] ${imageProjection}
    }
  }
`);

export const allTestimonialsQuery = defineQuery(`
  *[_type == "testimonial"] | order(order asc){
    _id,
    _type,
    quote,
    author,
    property,
    order
  }
`);

export const legalPageByPathQuery = defineQuery(`
  *[_type == "legalPage" && path == $path][0]{
    _id,
    _type,
    title,
    path,
    intro,
    sections,
    updatedAt,
    seo ${seoProjection}
  }
`);

export const propertyBySlugQuery = defineQuery(`
  *[_type == "property" && slug == $slug][0]{
    _id,
    _type,
    slug,
    label,
    logo ${imageProjection},
    navItems,
    addressLines,
    phones,
    email,
    maps,
    facebook,
    instagram,
    instagramFeedUrl,
    instagramApiUrl,
    spaInstagramApiUrl,
    bookingHref,
    bookingWidgetId,
    offersHref,
    blogPosts,
    awardBadges[] ${imageProjection},
    awardVariant
  }
`);

export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings"][0]{
    _id,
    _type,
    title,
    description,
    favicon ${imageProjection},
    bookNowLabel,
    footerNote,
    legalLinks,
    defaultSeo ${seoProjection}
  }
`);
