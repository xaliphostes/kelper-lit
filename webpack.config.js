const webpack = require("webpack");
const path = require("path");

module.exports = {
	mode: "development",
	entry: {
		main: "./src/App.ts",
	},
	output: {
		path: path.resolve(__dirname, "/web/"),
		filename: "js/[name].js",
		publicPath: "/web/",
	},
	resolve: {
		extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
		alias: {
			Utils: path.resolve(__dirname, "./src/utils/"),
		},
	},
	module: {
		rules: [
			{
				test: /\.(glsl|vs|fs)$/,
				loader: "ts-shader-loader"
			},
			{
				test: /\.tsx?$/,
				exclude: [/node_modules/, /tsOld/],
				loader: "ts-loader"
			}
		]
	},
	devServer: {
		static: path.join(__dirname, '/'),
		port: 8000,
		host: "0.0.0.0",
	}
}