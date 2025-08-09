// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook'

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import react from 'eslint-plugin-react'

export default tseslint.config(
  [
    globalIgnores(['dist']),
    {
      files: ['**/*.{ts,tsx}'],
      plugins: { react },
      extends: [
        js.configs.recommended,
        tseslint.configs.recommended,
        reactHooks.configs['recommended-latest'],
        reactRefresh.configs.vite,
        jsxA11y.flatConfigs.recommended,
      ],
      languageOptions: {
        ...jsxA11y.flatConfigs.recommended.languageOptions,
        ...react.configs.flat.recommended.languageOptions,
        ecmaVersion: 2020,
        globals: globals.browser,
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'error',
        'react/jsx-no-useless-fragment': 'error',
        'react/jsx-sort-props': 'error',
        'react/jsx-pascal-case': 'error',
        'react/function-component-definition': ['error', { namedComponents: 'arrow-function' }],
      },
    },
  ],
  storybook.configs['flat/recommended']
)
