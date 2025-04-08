const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { merge } = require('webpack-merge');
const path = require('path');
const options = { filter: (file) => !file.path.includes('-rtl.css') };

module.exports = merge(defaultConfig, {
	mode: 'production',
	entry: ['./src/index.js'],
	output: {
		path: path.resolve(__dirname, 'build/auto'),
		filename: '[name].js',
		chunkFilename: '[name].js',
	},
	optimization: {
		usedExports: true,
		moduleIds: 'deterministic',
		chunkIds: 'deterministic',
		splitChunks: {
			chunks: 'all',
		},
		minimize: true,
		minimizer: [
			new TerserPlugin({
				extractComments: true,
				parallel: true,
				terserOptions: {
					compress: {
						drop_console: true, // Removes all console statements
					},
				},
			}),
		],
	},
	resolve: {
		modules: ['src', 'node_modules'],
		extensions: ['.js', '.jsx'],
	},
	cache: {
		type: 'filesystem',
	},
	plugins: [
		new WebpackManifestPlugin(options),
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
