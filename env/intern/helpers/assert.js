import browserDebug from '../../../modules/browser/browser-debug'
const intern = require('intern').default
const {assert} = intern.getPlugin('chai')
require('./log')

const Command = require('@theintern/leadfoot/Command').default

const noErrorTypes = ['debug', 'info', 'log', 'verbose']
function errorPredicateDefault(log) {
	if (!log || typeof log.message === 'object' && log.message.level && noErrorTypes.indexOf(log.message.level) >= 0) {
		return false
	}

	const message = typeof log === 'string' ? log : log.message
	if (typeof message === 'string') {
		if (message.indexOf('/favicon.ico 0:0 Failed to load') >= 0) {
			return false
		}
	}

	return true
}

Command.prototype.checkLogs = function (errorPredicate) {
	return this
		.getAllLogs()
		.then(logs => {
			const predicate = log => errorPredicateDefault(log) && (!errorPredicate || errorPredicate(log))
			if (logs.some(predicate)) {
				return Promise.reject(new Error(`Browser errors: ${JSON.stringify(logs, null, 4)}`))
			}

			// logs = logs.filter(predicate)
			// if (logs.length) {
			// 	console.log(JSON.stringify(logs, null, 4))
			// }

			return []
		})
}

Command.prototype.checkAfterTestPage = function (errorPredicate) {
	return this
		.checkLogs(errorPredicate)
		.debugInfoOnError()
}

// region isNewWindow

/* eslint-disable */

function isNewWindow(id) {
	if (window[id]) {
		return false
	}
	window[id] = true
	return true
}

/* eslint-enable */

const isNewWindowId = 'cd546a3c65304683a2c76c4db720997f'

Command.prototype.getIsNewWindow = function (windowHandle) {
	return this
		.runInWindow(windowHandle, () => this
			.execute(isNewWindow, [isNewWindowId]))
}

Command.prototype.assertIsNewWindow = function (windowHandle) {
	return this
		.getIsNewWindow(windowHandle)
		.then(o => {
			assert.strictEqual(o, true)
			return o
		})
}

Command.prototype.assertIsOldWindow = function (windowHandle) {
	return this
		.getIsNewWindow(windowHandle)
		.then(o => {
			assert.strictEqual(o, false)
			return o
		})
}

// endregion

Command.prototype.testPage = function (func, errorPredicate) {
	return this
		.assertIsNewWindow()
		.checkLogs(errorPredicate)
		.then(() => func())
		.assertIsOldWindow()
		.checkAfterTestPage(errorPredicate)
		.end()
}

Command.prototype.testPageWithPolyfill = function (func, errorPredicate) {
	return this
		.testPage(() => this
			.loadScript(pathToUrl('static/libs/polyfill.js'))
			.checkLogs(errorPredicate)
			.then(() => func()), errorPredicate)
}

Command.prototype.testNavigate = function (selector, getUrlString, expectUrl, delay = 1000) {
	let task = this
	if (selector) {
		task = task
			.findByCssSelector(selector)
			.click()
	}

	task = task
		.delay(delay)
		.getCurrentUrl()
		.then(o => assert.strictEqual(getUrlString(new URL(o)), expectUrl))
		.end()

	return task
}

// Command.prototype.validateAll = function (urlRegex, errorResourcePredicate) {
// 	return this
// 		.executeAsync(browserDebug.validateAll)
// 		.then(resources => {
// 			resources = (resources || [])
// 			if (errorResourcePredicate) {
// 				resources = resources.filter(resources)
// 			}
//
// 			if (resources && resources.length) {
// 				throw new Error(`Error validate resources:\r\n${JSON.stringify(resources, null, 4)}`)
// 			}
// 		})
// }
