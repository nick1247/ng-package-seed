var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');

module.exports = function (env) {
    return {
        entry: {
            'polyfills': './demo/polyfills.ts',
            'vendor': './demo/vendor.ts',
            'main': './demo/main.ts'
        },

        resolve: {
            extensions: ['.ts', '.js'],
            modules: ['node_modules']
        },

        module: {
            exprContextCritical: false,
            rules: [
                {
                    test: /\.ts$/,
                    use: [
                        {
                            loader: 'ts-loader',
                            // options: {
                            //     logLevel: 'warn'
                            // }
                        }
                    ]
                },
				{ 
					test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
					use: "url-loader?limit=10000&minetype=application/font-woff&name=assets/[name].[hash].[ext]" 
				},
				{ 
					test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
					use: "file-loader?name=assets/[name].[hash].[ext]" 
				},
                {
                    test: /\.html$/,
                    use: 'html-loader?-minimize'
                },
                {
                    test: /\.css$/,
                    exclude: [path.resolve('./demo/src')],
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader', 
                        use: 'css-loader', 
                        publicPath: ''
                    })
                },
                {
                    test: /\.css$/,
                    include: [path.resolve('./demo/src')],
                    use: 'raw-loader'
                }
            ]
        },

        plugins: [
            new webpack.optimize.CommonsChunkPlugin({
                name: ['main', 'vendor', 'polyfills']
            }),

            new ExtractTextPlugin('style.css')
        ],

        devtool: 'source-map',

        output: {
            filename: '[name].js',
            path: path.resolve('./dist')
        },

        devServer: {
            port: 2000,
            contentBase: "demo",
            historyApiFallback: true
        }
    };
}