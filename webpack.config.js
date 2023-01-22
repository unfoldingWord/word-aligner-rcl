var path = require('path');

module.exports = {
  mode: 'none',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    libraryTarget: 'commonjs2',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: { babelrc: true },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpg|png|svg|ttf)$/,
        loader: 'file-loader',
        options: { name: '[path][name].[hash].[ext]' },
      },
    ],
  },
  externals: {
    'react': 'commonjs react',
    'string-punctuation-tokenizer': 'commonjs string-punctuation-tokenizer',
    'word-aligner': 'commonjs word-aligner',
  },
};
