const fs = require('fs')
const path = require('path')
const resolveFrom = require('resolve-from')
const caller = require('caller')
const postcss = require('postcss')
const postcssJsSyntax = require('postcss-js-syntax').default

const postcssInstance = postcss([])

function cssToJs(content, filename) {
	const stringified = postcssInstance.process(content, {
		stringifier(code, builder) {
			try {
				return postcssJsSyntax.stringify(code, builder)
			} catch (ex) {
				console.error(ex)
				throw ex
			}
		},
		from: filename
	}).css

	return JSON.parse(stringified)
}

function cssFileToJs(filename) {
	const content = fs.readFileSync(filename, 'utf-8')
	return cssToJs(content, filename)
}

global.requireCss = id => {
	const callerPath = path.dirname(caller())
	const filepath = resolveFrom(callerPath, id)
	return cssFileToJs(filepath)
}
