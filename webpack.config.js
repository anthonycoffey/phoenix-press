const path = require("path");
module.exports = {
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "phoenix-press.js",
  },
  devtool: "eval",
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
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  resolve: {
    modules: ["src", "node_modules"],
    extensions: [".js", ".jsx"], // Automatically resolve .js and .jsx extensions
  },
  cache: {
    type: "filesystem", // Stores cache on disk
  },
};
