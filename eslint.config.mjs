import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Must stay last: turns off stylistic rules that Prettier owns.
  prettier,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "public/sw.js",
    "public/sqlite/**",
    "public/swe-worker-*.js",
    "playwright-report/**",
    "test-results/**",
    // Third-party agent skills and their working files are not app code.
    ".claude/skills/**",
    ".taste-skill/**",
  ]),
]);

export default eslintConfig;
