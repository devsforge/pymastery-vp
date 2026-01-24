const path = require("path")
const MiniCSSExtractPlugin = require("mini-css-extract-plugin")
const HTMLWebpackPlugin = require("html-webpack-plugin")

const BASE_DIR = path.resolve(__dirname, "src")
const BUILD_DIR = path.resolve(__dirname, "_build", "webpack")
const ASSETS_DIR = path.resolve(__dirname, "assets")

const commonHTMLWebpackPluginConfig = {
    favicon: path.resolve(ASSETS_DIR, "favicon.ico"),
    inject: "body", // inject scripts at the bottom of the body
}

const icons = {
    moonIcon: "../assets/moon-svgrepo-com.svg",
    sunIcon: "../assets/sun-svgrepo-com.svg",
    passIcon: "../assets/check-mark-svgrepo-com.svg",
    failIcon: "../assets/cross-mark-svgrepo-com.svg",
}

const config = {
    mode: "development",
    entry: path.resolve(BASE_DIR, "conf.js"),
    output: {
        filename: "js/main.bundle.js",
        path: BUILD_DIR,
        clean: true,
    },
    devServer: {
        static: BUILD_DIR,
        port: 3000,
        hot: true,
    },
    plugins: [
        new MiniCSSExtractPlugin({ filename: "css/main.min.css" }),
        new HTMLWebpackPlugin({
            ...commonHTMLWebpackPluginConfig,
            template: path.resolve(BASE_DIR, "rdbms", "presentations", "normalization", "_index.hbs"),
            filename: path.resolve(BUILD_DIR, "normalization", "index.html"),
            templateParameters: {
                ...icons,
            },
        }),
    ],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    { loader: MiniCSSExtractPlugin.loader },
                    { loader: "css-loader" },
                    { loader: "sass-loader" },
                ]
            },
            {
                test: /\.css$/,
                use: [
                    { loader: MiniCSSExtractPlugin.loader },
                    { loader: "css-loader" },
                ]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
                type: "asset/resource",
                generator: { filename: "assets/[name][ext]" },
            },
            {
                test: /\.(handlebars|hbs)$/,
                loader: "handlebars-loader",
            },
            {
                test: /\.html$/,
                loader: "html-loader",
            },
        ]
    },
}

module.exports = config
