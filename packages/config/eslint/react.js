import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import base from "./base.js";

/** ESLint config for React (Vite) apps and the shared UI package. */
export default [
  ...base,
  {
    files: ["**/*.{ts,tsx,jsx}"],
    languageOptions: { globals: { ...globals.browser } },
    plugins: { react: reactPlugin, "react-hooks": reactHooks },
    settings: { react: { version: "detect" } },
    rules: {
      ...reactPlugin.configs.flat.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },
];
