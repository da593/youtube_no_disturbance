const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = path.join(__dirname, "..", "src");
const distDir = path.join(__dirname, "..", "dist")

module.exports = {
   mode: "production",
   entry: {
      popup: path.join(srcDir, 'popup.ts'),
      //background: path.join(srcDir, 'background.ts'),
      content_script: path.join(srcDir, 'content_script.ts')
    },
    output: {
        path: distDir,
        filename: "[name].js",
        clean: true
    },
    optimization: {
        splitChunks: {
            name: "vendor",
            chunks(chunk) {
              return chunk.name !== 'background';
            }
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
               { from: ".", to: distDir, context: "public"},
            ],
            options: {},
        }),
    ],
};