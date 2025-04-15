// eslint.config.js
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import stylisticJs from "@stylistic/eslint-plugin-js"; // 🔹 Import the plugin

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends(
        "next/core-web-vitals",
        "plugin:tailwindcss/recommended",
        "prettier"
    ),

    {
        plugins: {
            "@stylistic/js": stylisticJs,
        },
        rules: {
            "no-undef": "off",
            "@stylistic/js/indent": ["error", 2],
        },
    },
];

export default eslintConfig;
