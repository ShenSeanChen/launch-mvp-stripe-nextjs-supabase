import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 1. Load the base Next.js rules
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 2. Add your custom rules and ignores here
  {
    rules: {
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-unused-vars": ["warn", {
        "varsIgnorePattern": "^_",
        "argsIgnorePattern": "^_"
      }],
      "@typescript-eslint/no-explicit-any": "warn",
      "react-hooks/rules-of-hooks": "warn",
      "react/jsx-no-comment-textnodes": "warn"
    },
  },
  {
    // This replaces "ignorePatterns"
    ignores: ["node_modules/", ".next/", "public/"],
  }
];

export default eslintConfig;