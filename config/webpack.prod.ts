import * as webpack from 'webpack';
import * as webpackMerge from 'webpack-merge';
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';
let commonConfig = require('./webpack.common.ts');
let helpers = require('./helper.ts');

module.exports = webpackMerge(commonConfig, {
  devtool: 'source-map',
  output: {
    path: helpers.root('dist'),
    publicPath: '/',
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].chunk.js'
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({ // https://github.com/angular/angular/issues/10618
      mangle: {
        keep_fnames: true
      }
    }),
    new ExtractTextPlugin('[name].[hash].css'),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new webpack.LoaderOptionsPlugin({
      htmlLoader: {
        minimize: false // workaround for ng2
      }
    })
  ]
});
