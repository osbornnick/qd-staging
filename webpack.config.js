const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: { game: "./src/game.ts", index: "./src/index.ts" },
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
            template: "src/templates/game.html",
            filename: "game.html",
            chunks: ["game"],
        }),
        new HtmlWebpackPlugin({
            template: "src/templates/index.html",
            filename: "index.html",
            chunks: ["index"],
        }),
    ],
};
