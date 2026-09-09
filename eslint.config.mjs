import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  // Written by `npm run sanity:typegen`, not by hand. Sanity emits an empty
  // interface for a schema type that adds no fields of its own, which is
  // correct output but trips no-empty-object-type — and any fix here would
  // be overwritten on the next regeneration.
  {
    files: ["src/sanity/types.generated.ts"],
    rules: { "@typescript-eslint/no-empty-object-type": "off" },
  },
]);

export default eslintConfig;
