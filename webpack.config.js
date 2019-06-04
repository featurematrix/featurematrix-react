const path = require('path');

module.exports = {
    entry: './src/index.ts',
    output: {
        filename: 'featurematrix-react.js',
        path: path.resolve(__dirname),
        libraryTarget: 'umd',
        umdNamedDefine: true,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'awesome-typescript-loader'
            }
        ]
    },
    externals: {
        'react': 'react',
        'featurematrix-js': 'featurematrix-js'
    },
    mode: 'production',
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    }
};