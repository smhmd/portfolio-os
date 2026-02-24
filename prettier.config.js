export default {
  semi: false,
  singleQuote: true,
  jsxSingleQuote: true,
  bracketSameLine: true,

  plugins: ['prettier-plugin-tailwindcss'],
  tailwindStylesheet: './src/main.css',
  tailwindFunctions: ['clsx'],
}
