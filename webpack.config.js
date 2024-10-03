const path = require('path');
module.exports = {
  // externals:
  //   process.env.NODE_ENV === 'production'
  //     ? {
  //         react: 'React',
  //         'react-dom': 'ReactDOM',
  //       }
  //     : {},
  mode: 'development', // Conditionally set mode
  devtool: 'source-map', // Conditionally add source maps
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'entry',
                  corejs: 3, // Make sure core-js is installed
                },
              ],
              '@babel/preset-react',
            ],
          },
        },
      },
      {
        test: /\.sass$/, // Regex for .scss files
        use: [
          'style-loader', // Injects styles into the DOM
          'css-loader', // Turns CSS into CommonJS
          'sass-loader', // Compiles Sass to CSS
        ],
      },
    ],
  },
};
