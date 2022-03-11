const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: {
        tsp: "./src/tsp.ts",
        index: "./src/index.ts",
        knapsack: "./src/knapsack.ts",
    },
    devtool: "inline-source-map",
    mode: "development",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: "/node_modules/",
            },
            { test: /\.css$/i, use: ["style-loader", "css-loader"] },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "src/templates/tsp.html",
            filename: "tsp.html",
            chunks: ["tsp"],
        }),
        new HtmlWebpackPlugin({
            template: "src/templates/index.html",
            filename: "index.html",
            chunks: ["index"],
        }),
        new HtmlWebpackPlugin({
            template: "src/templates/knapsack.html",
            filename: "knapsack.html",
            chunks: ["knapsack"],
        }),
    ],
};
