// Rename this file to babel.config.cjs for Jest compatibility with ES modules
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    [
      'babel-plugin-transform-import-meta',
      {
        importStyle: 'base',
        env: {
          VITE_API_URL: ''
        }
      }
    ]
  ]
};
