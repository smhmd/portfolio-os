export default {
  semi: false,
  singleQuote: true,
  jsxSingleQuote: true,
  bracketSameLine: true,

  plugins: ['prettier-plugin-tailwindcss'],
  tailwindStylesheet: './app/main.css',
  tailwindFunctions: ['clsx'],
}
