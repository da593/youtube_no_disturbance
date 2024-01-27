const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = path.join(__dirname, "..", "src");
const distDir = path.join(__dirname, "..", "dist")

module.exports = {
   mode: "production",
   entry: {
        content_script: path.join(srcDir, 'content_script.ts'),
        to_option_page: path.join(srcDir, 'to_option_page.ts'),
        update_options: path.join(srcDir, 'update_options.ts'),
        whitelist: path.join(srcDir, 'whitelist.ts'),
        new_install_script: path.join(srcDir, 'new_install_script.ts')
    },
    output: {
        path: distDir,
        filename: ({ chunk: { name } }) => {
            return name !== 'whitelist' ? '[name].js': 'editor.bundle.js';
        },
        clean: true
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
        modules: ['node_modules'],
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