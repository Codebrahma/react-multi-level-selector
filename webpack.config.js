const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /(node_modules|build)/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.scss$/,
        sideEffects: true,
        loaders: ['style-loader', 'css-loader', 'sass-loader'],
        include: path.resolve(__dirname, 'src'),
      },
      {
        test: /\.css$/,
        include: [path.resolve(__dirname, 'src')],
        loader: 'style-loader!css-loader',
      },
    ],
  },
  externals: {
    react: 'commonjs react',
  },
};
