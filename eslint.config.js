import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  { ignores: ['dist/**', 'node_modules/**', 'playwright-report/**', 'test-results/**'] },
  {
    ...js.configs.recommended,
    files: ['**/*.{js,jsx}'],
  },
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: { globals: globals.browser },
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },
  {
    ...react.configs.flat.recommended,
    files: ['src/**/*.jsx'],
    settings: { react: { version: '18.3' } },
    rules: {
      ...react.configs.flat.recommended.rules,
      // This JavaScript project does not use runtime PropTypes validation.
      'react/prop-types': 'off',
    },
  },
  {
    // Vite uses the automatic JSX runtime; importing React is unnecessary.
    ...react.configs.flat['jsx-runtime'],
    files: ['src/**/*.jsx'],
  },
  {
    files: ['*.config.js', 'tests/**/*.js'],
    languageOptions: { globals: globals.node },
  },
];
