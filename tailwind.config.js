const plugin = require('tailwindcss/plugin');
const postcss = require('postcss');
const postcssJs = require('postcss-js');

const tokensToTailwind = require('./src/css-utils/tokens-to-tailwind.js');

// Raw design tokens
const colorPrimitiveTokens = require('./src/design-tokens/colors/color-primitives.json');
const colorSemanticTokens = require('./src/design-tokens/colors/color-semantics.json');
const fontTokens = require('./src/design-tokens/fonts.json');
const textLeadingTokens = require('./src/design-tokens/text-leading.json');

// Merge color tokens
const allColorTokens = {
  items: [...colorPrimitiveTokens.items, ...(colorSemanticTokens.items || [])]
};

// Process design tokens
const colors = tokensToTailwind(allColorTokens.items);
const fontFamily = tokensToTailwind(fontTokens.items);
const lineHeight = tokensToTailwind(textLeadingTokens.items);

module.exports = {
  content: ['./src/**/*.{html,js,jsx,mdx,njk,twig,vue}'],
  // Add color classes to safe list so they are always generated
  safelist: [],
  presets: [],
  theme: {
    colors,
    lineHeight,
    fontFamily,
    backgroundColor: ({theme}) => theme('colors'),
    textColor: ({theme}) => theme('colors'),
    margin: ({theme}) => ({
      auto: 'auto',
      ...theme('spacing')
    }),
    padding: ({theme}) => theme('spacing')
  },
  variantOrder: [
    'first',
    'last',
    'odd',
    'even',
    'visited',
    'checked',
    'empty',
    'read-only',
    'group-hover',
    'group-focus',
    'focus-within',
    'hover',
    'focus',
    'focus-visible',
    'active',
    'disabled'
  ],

  // Disables Tailwind's reset and usage of rgb/opacity
  corePlugins: {
    preflight: false,
    textOpacity: false,
    backgroundOpacity: false,
    borderOpacity: false
  },

  // Prevents Tailwind's core components
  blocklist: ['container'],

  // Prevents Tailwind from generating that wall of empty custom properties
  experimental: {
    optimizeUniversalDefaults: true
  },

  plugins: [
    // Generates custom property values from tailwind config
    plugin(function ({addComponents, config}) {
      let result = '';

      const currentConfig = config();

      const groups = [
        {key: 'colors', prefix: 'color'},
        {key: 'lineHeight', prefix: 'leading'},
        {key: 'fontFamily', prefix: 'font'},
        {key: 'fontWeight', prefix: 'font'}
      ];

      groups.forEach(({key, prefix}) => {
        const group = currentConfig.theme[key];

        if (!group) {
          return;
        }

        Object.keys(group).forEach(key => {
          result += `--${prefix}-${key}: ${group[key]};`;
        });
      });

      addComponents({
        ':root': postcssJs.objectify(postcss.parse(result))
      });
    })
  ]
};
