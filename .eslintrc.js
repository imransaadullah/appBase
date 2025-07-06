module.exports = {
  root: true,
  extends: [
    'expo',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-explicit-any': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'no-console': 'warn',
    'react/prop-types': 'off',
    'react/display-name': 'off',
  },
  env: {
    es6: true,
    node: true,
    'react-native/react-native': true,
  },
}; 