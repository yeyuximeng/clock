
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: "clock.js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      filename: 'index.html'
    })
  ],
  devServer: {
    contentBase: __dirname,
    open: true,
    port: 80,
    overlay: {
      errors: true
    }
  }
}


module.exports = config
