/**
 * One `<script type="application/ld+json">`, rendered on the server so the
 * structured data is in the HTML the server sends rather than added after
 * hydration.
 *
 * `<` is escaped so text in the data can never close the script tag early.
 * `BreadcrumbJsonLd` escapes the same way; it builds its own tag because it
 * also decides whether to render at all.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
