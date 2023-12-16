const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    index: "./src/index.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Todo List App",
      filename: "index.html",
      inject: "head",
      scriptLoading: "defer",
      template: path.resolve(__dirname, "./src/template.html"),
    }),
  ],
  output: {
    filename: "scripts/[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  optimization: {
    runtimeChunk: "single",
  },
};
