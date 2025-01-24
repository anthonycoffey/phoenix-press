const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  // mode: "development", // local development only
  // devtool: "eval", // local development only
  mode: "production",
  devtool: "source-map",
  entry: ["core-js/stable", "regenerator-runtime/runtime", "./src/index.js"],
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "phoenix-press.js",
    library: "PhoenixPress",
    libraryTarget: "umd",
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.sass$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true, // Enable CSS Modules for scoping
            },
          },
          "sass-loader",
        ],
      },
    ],
  },
  resolve: {
    modules: ["src", "node_modules"],
    extensions: [".js", ".jsx"],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false, // Avoid creating additional license files
      }),
    ],
  },
  cache: {
    type: "filesystem",
  },
};
