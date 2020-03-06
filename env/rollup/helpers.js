/* eslint-disable no-process-env,prefer-rest-params */
const path = require('path')

function getComponentName(...concatPaths) {
	return path.relative(
		process.cwd(),
		path.resolve(...concatPaths)
	)
		.replace(/\\/g, '/')
		.replace(/.[^/.]+$/, '')
}

function getComponentPath(...concatPaths) {
	if (!process.env.APP_CONFIG) {
		console.error('Environment variable APP_CONFIG is not defined', __filename)
		throw new Error('Environment variable APP_CONFIG is not defined')
	}

	return `dist/${process.env.APP_CONFIG}/components/${
		path.relative(
			path.resolve(process.cwd(), 'src'),
			path.resolve(...concatPaths)
		)
			.replace(/\\/g, '/')
			.replace(/^\//g, '')
	}.js`
}

function getComponentUrl(...concatPaths) {
	const url = `/${getComponentPath(...concatPaths)}`

	// console.log('URL = ', url)

	return url
}

function toCachedFunc(getKey, func) {
	const cache = {}

	return function () {
		const key = getKey.apply(this, arguments)
		const cacheItem = cache[key]
		if (typeof cacheItem !== 'undefined') {
			// console.log('toCachedFunc from cache')
			return cacheItem
		}

		// console.log('toCachedFunc')
		const result = func.apply(this, arguments)

		cache[key] = result

		return result
	}
}

module.exports = {
	getComponentName,
	getComponentPath,
	getComponentUrl,
	toCachedFunc,
}
