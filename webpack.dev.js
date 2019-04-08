const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "cheap-module-source-map", //"inline-source-map"
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "public", "dist")
  }
});
