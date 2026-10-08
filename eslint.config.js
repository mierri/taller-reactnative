const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    rules: {
      '@typescript-eslint/no-redeclare': 'off',
    },
  },
  {
    ignores: ["dist/*"],
  }
]);
