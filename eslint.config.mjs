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
    // Ancien design conservé pour référence (CLAUDE.md) : non maintenu, non linté.
    "src/components/home/**",
    "src/components/landing/**",
    "src/components/chatbot/**",
    "src/components/forms/**",
    "src/components/layout/**",
    "src/components/_archive_old_design/**",
    // Edge Function Deno : hors tsconfig, lintée par Deno, pas par ESLint.
    "supabase/functions/**",
  ]),
  {
    rules: {
      // Règles du React Compiler : faux positifs connus avec `{...register('x')}` de
      // react-hook-form et avec un chargeur async appelé dans un effet (ERREURS-CONNUES E01).
      "react-hooks/refs": "warn",
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
