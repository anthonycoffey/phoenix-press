const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const { merge } = require("webpack-merge");
const path = require("path");
const options = {};
module.exports = merge(defaultConfig, {
  mode: "production",
  devtool: "source-map",
  // mode: "development",
  // devtool: "eval",
  entry: ["./src/index.js"],
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
    ],
  },
  output: {
    path: path.resolve(__dirname, "build"), // Convert to an absolute path
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].[contenthash].js",
  },
  optimization: {
    moduleIds: "deterministic",
    chunkIds: "deterministic",
    splitChunks: {
      chunks: "all",
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: true,
      }),
    ],
  },
  resolve: {
    modules: ["src", "node_modules"],
    extensions: [".js", ".jsx"],
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
  cache: {
    type: "filesystem",
  },
  plugins: [
    new WebpackManifestPlugin(options),
    new CleanWebpackPlugin(),
    new BundleAnalyzerPlugin(),
    new CompressionPlugin({
      filename: "[path][base].gz",
      algorithm: "gzip",
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
  ],
});
