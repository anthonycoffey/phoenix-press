const plugins = [
	[
		'babel-plugin-import',
		{
			libraryName: '@mui/material',
			libraryDirectory: '',
			camel2DashComponentName: false,
		},
		'core',
	],
];

const presets = [
	'@wordpress/babel-preset-default',
	'@babel/preset-env',
	'@babel/preset-react',
];

module.exports = { presets, plugins };
