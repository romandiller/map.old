const path = require('path');

module.exports = {

	mode: 'production',
	entry: './public/javascripts/main.js',
	output: {
		path: path.resolve(__dirname, 'public/production/javascripts'),
		filename: 'scripts.min.js',
		publicPath: 'public/production/javascripts'
	},
	devServer: {
		overlay: true
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: '/node_modules/'
			}
		]
	}

};