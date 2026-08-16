import globals from "globals";
import base from "./base.js";

/**
 * ESLint config for the Next.js app.
 *
 * Add the Next.js plugin in the app's own eslint.config.mjs (it ships with the
 * app so the plugin version tracks the Next version), then spread this after it.
 */
export default [
  ...base,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
];
