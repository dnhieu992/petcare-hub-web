import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

/**
 * Shared ESLint base for every PetCare workspace.
 *
 * Enforces the two boundaries that keep the monorepo maintainable:
 *  - packages are consumed through their public entry, never deep-imported;
 *  - apps never import other apps (share via packages/ instead).
 */
export const base = tseslint.config(
  { ignores: ["**/dist/**", "**/.next/**", "**/node_modules/**", "**/*.gen.*"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@petcare/*/src/*", "@petcare/*/dist/*"],
              message:
                "Import from a package's public entry (e.g. '@petcare/ui'), never its internals.",
            },
            {
              group: [
                "@petcare/clinic",
                "@petcare/clinic/*",
                "@petcare/admin",
                "@petcare/admin/*",
                "@petcare/pet-portal",
                "@petcare/pet-portal/*",
              ],
              message:
                "Apps must not import other apps. Extract shared code into a package under packages/.",
            },
          ],
        },
      ],
    },
  },
  eslintConfigPrettier,
);

export default base;
