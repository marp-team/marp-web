const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

module.exports = env => {
  const production = !!(env || {}).production

  return {
    devServer: {
      contentBase: path.join(__dirname, 'public'),
    },
    devtool: production ? false : 'cheap-module-source-map',
    entry: { index: './index.js' },
    mode: production ? 'production' : 'development',
    module: {
      rules: [
        {
          test: /\.[jt]s$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.worker\.[jt]s$/,
          exclude: /node_modules/,
          loader: ['worker-loader', 'babel-loader'],
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
      alias: {
        // Stop bundling a huge and unnecessary esprima module
        // https://github.com/nodeca/js-yaml/pull/435
        'js-yaml$': path.resolve(
          __dirname,
          'node_modules/js-yaml/dist/js-yaml.min.js'
        ),
      },
      extensions: ['.ts', '.js'],
    },
  }
}
