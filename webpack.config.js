const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')
const path = require('path')

module.exports = env => {
  const production = !!(env || {}).production

  const cssLoaders = modules => [
    production ? MiniCssExtractPlugin.loader : 'style-loader',
    {
      loader: 'css-loader',
      options: {
        modules,
        camelCase: true,
        sourceMap: !production,
        importLoaders: 2,
      },
    },
    'postcss-loader',
    'sass-loader',
  ]

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
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.worker\.[jt]sx?$/,
          exclude: /node_modules/,
          loader: ['worker-loader', 'babel-loader'],
        },
        {
          test: /\.module\.(sa|sc|c)ss$/,
          use: cssLoaders(true),
        },
        {
          test: /\.(sa|sc|c)ss$/,
          exclude: /\.module\.(sa|sc|c)ss$/,
          use: cssLoaders(false),
        },
        {
          test: /\.(png|gif|jpe?g|svg|woff2?|eot|ttf)$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'assets/[name].[hash:8].[ext]',
            },
          },
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin(),
      production &&
        new WorkboxPlugin.GenerateSW({
          cacheId: 'marp-web',
          globDirectory: production ? './dist' : './public',
          globPatterns: ['index.html', '**/*.{png,svg}'],
        }),
    ].filter(p => p),
    resolve: {
      alias: {
        // Stop bundling a huge and unnecessary esprima module
        // https://github.com/nodeca/js-yaml/pull/435
        'js-yaml$': path.resolve(
          __dirname,
          'node_modules/js-yaml/dist/js-yaml.min.js'
        ),
      },
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
  }
}
