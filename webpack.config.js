const UglifyJSWebpackPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    entry: {
        app: './index.js',
    },
    output: {
        filename: 'react-print-html.min.js',
        path: __dirname + '/dist'
    },
    plugins: [
        // 压缩输出的 JS 代码
        new UglifyJSWebpackPlugin()
    ],
};