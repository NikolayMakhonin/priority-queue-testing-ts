import browserDebug from '../../../modules/browser/browser-debug'

const Command = require('@theintern/leadfoot/Command').default

Command.prototype.getAllLogs = function () {
	return this
		.getAvailableLogTypes()
		.then(logTypes => Promise
			.all(logTypes
				.map(logType => this
					.getLogsFor(logType)
					.then(logs => logs
						.map(log => {
							log.type = logType
							try {
								const message = JSON.parse(log.message)
								const keys = Object.keys(message)
								if (keys.length === 1) {
									log.message = message[keys[0]]
								} else {
									log.message = message
								}
							} catch (ex) {}
							return log
						})))))
		.then(logs => logs
			.flatMap(o => o))
}

/* eslint-disable */

function dataToLog(getDataScript) {
	var data = eval(getDataScript)
	return data
}

/* eslint-enable */

Command.prototype.logRemote = function (prefix, remoteGetDataScript) {
	return this
		.execute(dataToLog, [`(${remoteGetDataScript.toString()})();`])
		.then(log => {
			console.log(prefix, log)
		})
}

Command.prototype.logThis = function (prefix, transformFunc) {
	return this
		.then(data => {
			console.log(prefix, transformFunc ? transformFunc(data) : data)
		})
}

Command.prototype.getHtml = function () {
	return this
		// eslint-disable-next-line no-undef
		.execute(() => new XMLSerializer().serializeToString(document))
}

Command.prototype.getUserAgent = function () {
	return this
		// eslint-disable-next-line no-undef
		.execute(() => navigator.userAgent)
}

Command.prototype.getDebugInfo = function () {
	return this
		.execute(browserDebug.getDebugInfo)
}

Command.prototype.debugInfoOnError = function () {
	const root = this.getRoot()

	return this
		.catch(err => Promise.all([
			root.getAllLogs(),
			root.getUserAgent(),
			root.getHtml(),
			root.getDebugInfo()
		])
			.then(([logs, userAgent, html, debugInfo]) => {
				console.debug(`--------------- Debug Info: ---------------\n${JSON.stringify({
					logs,
					userAgent,
					html: (html || '').substring(0, 1000),
					debugInfo
				}, null, 4)}\n---------------   Error:   ---------------`)

				return Promise.reject(err)
			}))
}
