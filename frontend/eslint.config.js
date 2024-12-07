module.exports = [
    {
        files: ["*.ts", "*.tsx"],
        parser: "@typescript-eslint/parser",
        parserOptions: {
            ecmaVersion: 2020,
            sourceType: "module"
        },
        extends: [
            "eslint:recommended",
            "plugin:@typescript-eslint/recommended",
            "plugin:prettier/recommended"
        ],
        plugins: ["@typescript-eslint", "prettier"],
        rules: {
            "prettier/prettier": ["error"],
            semi: ["error", "always"],
            quotes: ["error", "single"],
            "max-len": ["error", { code: 80 }]
        }
    }
]
