import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default tseslint.config([
  // Ignora artefatos gerados/descartáveis que não devem ser lintados:
  // - "dist": build de produção.
  // - "src/domain/models": tipos gerados pelo OpenAPI Generator (usam
  //   `export namespace`, que dispara no-namespace — não editamos à mão).
  // - ".mock/src": output do generate:types (não versionado; só serve de
  //   fonte antes de mover os models para src/domain/models).
  // - "public/mockServiceWorker.js": gerado pelo MSW.
  globalIgnores([
    "dist",
    "src/domain/models/**",
    ".mock/**",
    "public/mockServiceWorker.js",
  ]),
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      "no-useless-catch": "off",
      "react-refresh/only-export-components": "off",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          disallowTypeAnnotations: false,
        },
      ],
    },
  },
]);
