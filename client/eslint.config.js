import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
    {
        // Chặn các thư mục không cần soi lỗi
        ignores: ["dist", "node_modules", "build"],
    },
    {
        // Áp dụng cho cả file .ts và .tsx
        files: ["**/*.{ts,tsx}"],
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended, // Sử dụng bộ luật TS khuyến cáo
            ...tseslint.configs.strict, // Ép chặt hơn để tránh code ẩu
        ],
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
        },
        languageOptions: {
            ecmaVersion: 2020,
            globals: {
                ...globals.browser,
                ...globals.node, // Cho phép dùng cả biến của Node (Backend)
            },
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": [
                "warn",
                { allowConstantExport: true },
            ],
            // QUY TẮC CHO TEAM:
            "@typescript-eslint/no-explicit-any": "error", // Cấm dùng 'any'. Phải định nghĩa type rõ ràng.
            "@typescript-eslint/no-unused-vars": "warn", // Khai báo mà không dùng sẽ nhắc nhở.
            "no-console": "warn", // Không để log tràn lan.
        },
    },
    prettierConfig
);
