const path = require("path");

module.exports = {
  mode: "development", // Ensures that Webpack runs in development mode
  devtool: "source-map", // Add source maps for easier debugging
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.sass$/, // Regex for .scss files
        use: [
          "style-loader", // Injects styles into the DOM
          "css-loader", // Turns CSS into CommonJS
          "sass-loader", // Compiles Sass to CSS
        ],
      },
    ],
  },
  // externals: {
  //   react: "React",
  //   "react-dom": "ReactDOM",
  // },
};
