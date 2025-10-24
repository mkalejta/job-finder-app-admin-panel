// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "no-var": "error",
      "prefer-const": ["error", { "destructuring": "all" }],
      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        { "accessibility": "explicit", "overrides": { "constructors": "no-public" } }
      ],
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        {
          "allowExpressions": false,
          "allowTypedFunctionExpressions": false,
          "allowHigherOrderFunctions": false,
          "allowConciseArrowFunctionExpressionsStartingWithVoid": false
        }
      ],
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@angular-eslint/directive-selector": [
        "error",
        { "type": "attribute", "prefix": "mk", "style": "camelCase" }
      ],
      "@angular-eslint/component-selector": [
        "error",
        { "type": "element", "prefix": "mk", "style": "kebab-case" }
      ]
    }
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  }
);
