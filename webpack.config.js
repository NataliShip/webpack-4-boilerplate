const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

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
  cssModules: {
    loader: 'css-loader',
    options: {
      modules: {
        localIdentName: '[name]__[local]--[hash:base64:5]'
      }
    }
  }
}

module.exports = {
  mode: 'development',

  entry: {
    main: './index.js'
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

  plugins: [
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
  ],

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
          loaders.less
        ]
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          loaders.miniCssExtract,
          loaders.css,
          loaders.sass
        ]
      },
      {
        test: /\.module.sass$/,
        use: [
          loaders.miniCssExtract,
          loaders.cssModules,
          loaders.sass
        ]
      },
      {
        test: /\.(jpe?g|svg|png|gif)$/,
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
        test: /\.(ttf|woff|woff2|eot|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[hash:6].[ext]'
            }
          }
        ]
      }
    ]
  }
}
