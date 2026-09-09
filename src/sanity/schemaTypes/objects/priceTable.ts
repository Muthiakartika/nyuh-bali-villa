import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * The rate table `toArticleBlocks` recovers from the spa post — named columns
 * and one row per service. Authored here directly, an editor emits the
 * `price` block shape straight away and the recovery pass leaves it alone.
 */
export const priceRow = defineType({
  name: "priceRow",
  title: "Row",
  type: "object",
  fields: [
    defineField({
      name: "cells",
      title: "Cells",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description: "One value per column, in the same order as the column headings.",
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { cells: "cells" },
    prepare: ({ cells }) => ({ title: (cells ?? []).join("  ·  ") || "Empty row" }),
  },
});

export const priceTable = defineType({
  name: "priceTable",
  title: "Rate table",
  type: "object",
  fields: [
    defineField({
      name: "columns",
      title: "Column headings",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description: 'For example: Service, Duration, Cost (IDR).',
      validation: (Rule) => Rule.required().min(2).max(6),
    }),
    defineField({
      name: "rows",
      title: "Rows",
      type: "array",
      of: [defineArrayMember({ type: "priceRow" })],
      validation: (Rule) =>
        Rule.required().min(1).custom((rows, context) => {
          const columns = (context.parent as { columns?: string[] } | undefined)?.columns;
          if (!columns || !rows) return true;
          const wrong = (rows as Array<{ cells?: string[] }>).findIndex(
            (row) => (row?.cells?.length ?? 0) !== columns.length,
          );
          return wrong === -1
            ? true
            : `Row ${wrong + 1} has a different number of cells than there are columns.`;
        }),
    }),
  ],
  preview: {
    select: { columns: "columns", rows: "rows" },
    prepare: ({ columns, rows }) => ({
      title: (columns ?? []).join(" · ") || "Rate table",
      subtitle: `${rows?.length ?? 0} row${rows?.length === 1 ? "" : "s"}`,
    }),
  },
});
