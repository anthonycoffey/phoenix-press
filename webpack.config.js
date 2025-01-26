const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const CompressionPlugin = require('compression-webpack-plugin');
const { merge } = require('webpack-merge');

module.exports = merge(defaultConfig, {
	mode: 'production',
	devtool: 'source-map',
	entry: ['./src/index.js'],
	output: {
		filename: '[name].[contenthash].js',
		chunkFilename: '[name].[contenthash].js',
	},
	optimization: {
		moduleIds: 'deterministic',
		chunkIds: 'deterministic',
		splitChunks: {
			chunks: 'all',
		},
		minimize: true,
		minimizer: [
			new TerserPlugin({
				extractComments: true,
			}),
		],
	},
	cache: {
		type: 'filesystem',
	},
	plugins: [
		new CleanWebpackPlugin(),
		new BundleAnalyzerPlugin(),
		new CompressionPlugin({
			filename: '[path][base].gz',
			algorithm: 'gzip',
			test: /\.(js|css|html|svg)$/,
			threshold: 10240,
			minRatio: 0.8,
		}),
	],
});
