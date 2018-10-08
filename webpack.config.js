const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

module.exports = env => {
  const production = !!(env || {}).production

  return {
    devServer: {
      contentBase: path.join(__dirname, 'public'),
    },
    entry: { index: './index.js' },
    mode: production ? 'production' : 'development',
    module: {
      rules: [
        {
          test: /\.[tj]s$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            production ? MiniCssExtractPlugin.loader : 'style-loader',
            { loader: 'css-loader', options: { importLoaders: 2 } },
            'postcss-loader',
            'sass-loader',
          ],
        },
      ],
    },
    plugins: [new MiniCssExtractPlugin()],
    resolve: {
      extensions: ['.ts', '.js'],
    },
  }
}
