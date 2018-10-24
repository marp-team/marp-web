module.exports = {
  presets: ['@babel/env', '@babel/typescript'],
  plugins: [
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread',
    [
      '@babel/plugin-transform-react-jsx',
      {
        pragma: 'h',
      },
    ],
  ],
}
