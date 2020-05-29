const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: './client/src',
  output: {
    path: path.resolve(__dirname, 'client', 'dist'),
    filename: 'bundle.js',
    publicPath: path.resolve(__dirname, 'client', 'dist')
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'client', 'src')
        ],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ],
            plugins: [
              [
                'transform-imports', {
                  '@material-ui/core': {
                    'transform': '@material-ui/core/esm/${member}',
                    'preventFullImport': true
                  },
                  '@material-ui/icons': {
                    'transform': '@material-ui/icons/esm/${member}',
                    'preventFullImport': true
                  }
                }
              ]
            ]
          }
        }
      }
    ]
  }
}