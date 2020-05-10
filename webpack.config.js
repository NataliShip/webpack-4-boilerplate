const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const optimization = () => {
  const config = {
      splitChunks: {
        chunks: 'all'
      }
    }

  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetsWebpackPlugin(),
      new TerserPlugin()
    ]
  }

  return config
}

const filename = (ext) => isDev ? `[name].${ext}` : `[name].[hash:6].${ext}`

const babelOptions = (preset) => {
  const opts = {
    presets: [
      '@babel/preset-env',
      '@babel/preset-react'
    ],
    plugins: [
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-optional-chaining'
    ]
  }

  if (preset) opts.presets.push(preset)

  return opts
}

const jsLoaders = (preset) => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: babelOptions(preset)
    }
  ]

  if (isDev) loaders.push('eslint-loader')

  return loaders
}

const loaders = {
  miniCssExtract: {
    loader: MiniCssExtractPlugin.loader,
    options: {
      hmr: isDev,
      reloadAll: true
    }
  },
  css: 'css-loader',
  less: 'less-loader',
  sass: 'sass-loader',
  postcss: {
    loader: 'postcss-loader',
    options: {
      sourceMap: true,
      plugins: () =>
        [require('autoprefixer')]
    }
  },
  cssModules: {
    loader: 'css-loader',
    options: {
      modules: {
        localIdentName: '[name]__[local]--[hash:base64:5]'
      }
    }
  }
}

const plugins = () => {
  const base = [
    new HTMLWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: isProd
      }
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'src/favicon.ico'),
        to: path.resolve(__dirname, 'dist')
      }
    ]),
    new MiniCssExtractPlugin({
      filename: filename('css')
    })
  ]

  if (isProd) base.push(new BundleAnalyzerPlugin())

  return base
}

module.exports = {
  mode: 'development',

  entry: {
    main: ['@babel/polyfill', './index.js']
  },

  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist')
  },

  context: path.resolve(__dirname, 'src'),

  resolve: {
    extensions: ['.js', '.jsx', '.css', '.sass'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
      components: path.resolve(__dirname, 'src/components'),
      assets: path.resolve(__dirname, 'src/assets'),
      styles: path.resolve(__dirname, 'src/styles'),
    }
  },

  optimization: optimization(),

  devServer: {
    port: 4000,
    hot: isDev
  },

  devtool: isDev ? 'source-map' : '',

  plugins: plugins(),

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          loaders.miniCssExtract,
          loaders.css
        ]
      },
      {
        test: /\.less$/,
        use: [
          loaders.miniCssExtract,
          loaders.css,
          loaders.postcss,
          loaders.less
        ]
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          loaders.miniCssExtract,
          loaders.css,
          loaders.postcss,
          loaders.sass
        ]
      },
      {
        test: /\.module.sass$/,
        use: [
          loaders.miniCssExtract,
          loaders.cssModules,
          loaders.postcss,
          loaders.sass
        ]
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: [
            {
              loader: 'file-loader',
              options: {
                name: 'images/[name].[hash:6].[ext]'
              }
            }
          ]
      },
      {
        test: /\.svg$/,
        oneOf: [
          {
            resourceQuery: /inline/,
            use: 'raw-loader'
          },
          {
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: 'images/[name]_[hash:6].[ext]',
                  esModule: false
                }
              }
            ]
          }
        ]
      },
      {
        test: /\.(ttf|woff|woff2|eot|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[hash:6].[ext]'
            }
          }
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: jsLoaders()
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: jsLoaders('@babel/preset-typescript')
      }
    ]
  }
}
