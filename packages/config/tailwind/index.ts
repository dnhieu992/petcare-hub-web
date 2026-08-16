import type { Config } from "tailwindcss";

/**
 * Shared Tailwind preset — the single source of truth for design tokens.
 *
 * Each app's tailwind.config.ts should do:
 *   import { petcarePreset } from "@petcare/config/tailwind";
 *   export default { presets: [petcarePreset], content: [...] } satisfies Config;
 *
 * Add colors, spacing, radius, typography tokens under theme.extend so every
 * app (and the @petcare/ui components) stays visually consistent.
 */
export const petcarePreset = {
  darkMode: "class",
  theme: {
    extend: {
      // Design tokens go here — keep them in one place, consumed by all apps.
    },
  },
  plugins: [],
} satisfies Partial<Config>;

export default petcarePreset;
