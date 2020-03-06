const {buildLib} = require('../helpers')

// const fileOutput = path.resolve('static/polyfills/polyfill-custom.js')
// const fileOutput = path.resolve(__dirname, './bundle.js')

buildLib({
	fileInput : require.resolve('./all.js'),
	fileOutput: 'static/libs/polyfill.js',
})
	.then(() => {
		console.log('polyfill build completed')
	})
