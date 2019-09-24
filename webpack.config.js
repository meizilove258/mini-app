const path = require('path');
const MiniWebpackPlugin = require('./plugins/mini-webpack-plugin/lib/index.js');

module.exports = {
    mode: 'development',
    entry: {
        app: path.resolve(__dirname, 'src/app.js')
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: /src/,
                exclude: /app.js$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                            context: path.resolve('src')
                        }
                    }
                ]
            },
            {
                test: /\.json$/,
                include: /src/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                            context: path.resolve('src')
                        }
                    }
                ]
            },
            {
                test: /\.wxss$/,
                include: /src/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                            useRelativePath: true,
                            context: path.resolve('src')
                        }
                    },
                    {
                        loader: 'css-loader',
                    }
                ]
            },
            {
                test: /\.wxml$/,
                include: /src/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                            useRelativePath: true,
                            context: path.resolve('src'),
                        },
                    },
                    {
                        loader: path.resolve(__dirname, 'loaders/wxml-loader1/lib/index.js'),
                        options: {
                            root: path.resolve('src'),
                            enforceRelativePath: true,
                        },
                    },
                ],
            }
        ]
    },
    plugins: [
        new MiniWebpackPlugin()
    ]
}