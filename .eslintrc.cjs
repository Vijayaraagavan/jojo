/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
    // '@vue/eslint-config-prettier/skip-formatting'
  ],
  rules: {
    // 'no-unused-vars': import.meta.env.MODE == 'production' ? 'error' : 'warn'
    'no-unused-vars': 'error'
  },
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
