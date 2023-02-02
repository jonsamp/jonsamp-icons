require('dotenv').config();

const svgo = require('@figma-export/transform-svg-with-svgo');
const fileId = process.env.FILE_ID;
const capitalize = (s) => {
  return s.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join('');
};
const outputters = [
  require('@figma-export/output-components-as-svg')({ output: './' }),
  require('@figma-export/output-components-as-svgr')({
    getFileExtension: () => '.tsx',
    getComponentName: ({ componentName, pageName }) => {
      if (pageName === 'outline') {
        return capitalize(componentName);
      }

      return capitalize(componentName) + capitalize(pageName);
    },
    getSvgrConfig: () => ({ typescript: true }),
    output: './src',
  }),
];

/** @type {import('svgo').PluginConfig[]} */
const solidSVGOConfig = [
  {
    name: 'removeDimensions',
    active: true
  },
  {
    name: 'sortAttrs',
    active: true,
  },
  {
    name: 'removeAttrs',
    params: {
      attrs: "fill"
    }
  },
  {
    name: 'addAttributesToSVGElement',
    params: {
      attribute: {
        fill: "currentColor"
      }
    }
  }
];

/** @type {import('svgo').PluginConfig[]} */
const outlineSVGOConfig = [
  {
    name: 'removeDimensions',
    active: true,
  },
  {
    name: 'sortAttrs',
    active: true,
  },
  {
    name: 'removeAttrs',
    params: {
      attrs: 'stroke',
    },
  },
  {
    name: 'addAttributesToSVGElement',
    params: {
      attribute: {
        stroke: 'currentColor',
      },
    },
  },
];

/** @type {import('@figma-export/types').FigmaExportRC} */
module.exports = {
  commands: [
    [
      'components',
      {
        fileId,
        onlyFromPages: ['outline'],
        transformers: [svgo({ multipass: true, plugins: outlineSVGOConfig })],
        outputters,
      },
    ],
    [
      'components',
      {
        fileId,
        onlyFromPages: ['solid'],
        transformers: [svgo({ multipass: true, plugins: solidSVGOConfig })],
        outputters,
      },
    ]
  ],
};
