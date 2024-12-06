export default {
  semi: false,
  singleQuote: true,
  jsxSingleQuote: true,
  bracketSameLine: true,

  plugins: ['prettier-plugin-tailwindcss'],
  tailwindStylesheet: './app/tailwind.css',
  tailwindFunctions: ['clsx'],
}
