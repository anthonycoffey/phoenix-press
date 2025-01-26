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
  // mode: "production",
  // devtool: false,
  mode: "development",
  devtool: "source-map",
  entry: ["./src/index.js"],
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].[contenthash].js",
  },
  optimization: {
    usedExports: true,
    moduleIds: "deterministic",
    chunkIds: "deterministic",
    splitChunks: {
      chunks: "all",
      // cacheGroups: {
      //   vendor: {
      //     test: /[\\/]node_modules[\\/]/,
      //     name(module) {
      //       const packageName = module.context.match(
      //         /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
      //       )[1];
      //       return `npm.${packageName.replace("@", "")}`;
      //     },
      //   },
      // },
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
  cache: {
    type: "filesystem",
  },
  externals: {
    "@mui/material": "MaterialUI",
    "@emotion/react": "emotionReact",
    "@emotion/styled": "emotionStyled",
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
