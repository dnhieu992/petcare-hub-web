import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  {
    ignores: [".worktrees/**"],
  },
  ...nextCoreWebVitals,
];

export default eslintConfig;
