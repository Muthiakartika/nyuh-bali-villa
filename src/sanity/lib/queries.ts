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
  ogTitle,
  ogDescription,
  image ${imageProjection},
  canonicalUrl,
  noIndex
}`;

/**
 * A link, with its internal reference already resolved to a path.
 *
 * The reference wins over the typed `href` here rather than in the renderer,
 * so everything downstream — the section blocks, the footer, portable text —
 * sees one `href` string and never has to know which way it was authored.
 *
 * Each branch of the `select` is the URL this project actually builds for
 * that document type: `page`, `post` and `legalPage` carry an explicit path,
 * a room lives under its property's /villa/, and every experience is an Ubud
 * page whose slug already carries its group ("retreat/couples").
 */
const referenceHref = `{"resolved": select(
  _type == "room" => "/" + property + "/villa/" + slug.current,
  _type == "experience" => "/ubud/" + slug,
  defined(path) => path
)}.resolved`;

/**
 * An uploaded file wins wherever one exists, without also requiring the
 * `linkType` radio to say "file" — the same rule an image follows, where the
 * asset beats `externalUrl`. The guard used to be there and it made the
 * upload box a no-op on every link the migration seeded, because those carry
 * no `linkType`: an editor could drop a new menu in, publish, and watch the
 * button go on opening the old PDF with nothing to say why.
 *
 * `->` cannot be followed by a function call — `reference->select(…)` is a
 * parse error — so the branch runs inside a projection and the one attribute
 * it computes is read straight back off it. Verified against the dataset.
 */
const linkProjection = `{
  ...,
  "href": select(
    linkType == "internal" && defined(reference) => reference->${referenceHref},
    defined(file.asset) => file.asset->url,
    href
  )
}`;

/**
 * A rich-text value whose link annotations have had their references
 * resolved, and which survives being pointed at a plain string.
 *
 * `packageItem.description` and `packageListSection.intro` became rich text
 * in this pass and their existing values are strings until the migration has
 * run (`npm run sanity:rich-text`). Projecting `field[]{…}` at a string
 * yields `null` — a blanked paragraph rather than a visible error — so the
 * guard checks for a block first and passes anything else through untouched.
 * That makes the projection correct before, during and after the migration,
 * which is the same property `localizeUploads` was built for.
 *
 * **Written out once per field rather than built by a helper.** A function
 * call inside these template literals is the one thing `sanity typegen`
 * cannot evaluate — it reports "Unsupported expression type" and skips the
 * whole query, which silently costs the project the GROQ-against-schema check
 * that is the reason typegen is run at all. Identifiers it follows; calls it
 * does not.
 */
const descriptionProjection = `"description": select(
  description[0]._type == "block" => description[]{
    ...,
    markDefs[] ${linkProjection}
  },
  description
)`;

const introProjection = `"intro": select(
  intro[0]._type == "block" => intro[]{
    ...,
    markDefs[] ${linkProjection}
  },
  intro
)`;

const paragraphsProjection = `"paragraphs": select(
  paragraphs[0]._type == "block" => paragraphs[]{
    ...,
    markDefs[] ${linkProjection}
  },
  paragraphs
)`;

const bodyProjection = `"body": select(
  body[0]._type == "block" => body[]{
    ...,
    markDefs[] ${linkProjection}
  },
  body
)`;

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
    images[] ${imageProjection},
    ctas[] ${linkProjection},
    ${descriptionProjection}
  },
  categories[]{
    ...,
    image ${imageProjection}
  },
  action ${linkProjection},
  actions[] ${linkProjection},
  cta ${linkProjection},
  ${bodyProjection},
  ${introProjection},
  ${paragraphsProjection},
  packageSet->{
    _id,
    title,
    alwaysIncluded,
    packages[]{
      ...,
      images[] ${imageProjection},
      ctas[] ${linkProjection},
      ${descriptionProjection}
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
  cardImage ${imageProjection},
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
      images[] ${imageProjection},
      ctas[] ${linkProjection},
      ${descriptionProjection}
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
    checkRatesLabel,
    galleryHeading,
    detailsHeading,
    amenitiesHeading,
    recommendedForHeading,
    inclusionsHeading,
    blogLabel,
    relatedRetreatsHeading,
    inquiryHeading,
    followInstagramLabel,
    dealHeadline,
    dealCode,
    dealButtonLabel,
    homeLogo ${imageProjection},
    footerLogo ${imageProjection},
    footerBookingLabel,
    footerMenuHeading,
    footerMenuLinks[] ${linkProjection},
    footerBlogHeading,
    footerNote,
    legalLinks[] ${linkProjection},
    defaultSeo ${seoProjection}
  }
`);
