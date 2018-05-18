const webpack = require('webpack');

module.exports = {
  entry: [
    // WHY not .jsx ???
    './src/index.jsx',
    'react-hot-loader/patch'
  ],
  devtool: "eval-source-map", // added for devtool in chrome.
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: './dist'
  }
};
