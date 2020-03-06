const intern = require('intern').default
const Command = require('@theintern/leadfoot/Command').default

/* eslint-disable */

function openWindow(url, name, features) {
	window.open(url, name, features)
}

/* eslint-enable */

Command.prototype.openWindow = function (width, height) {
	return this
		// .get('about:blank')
		.execute(openWindow, ['about:blank', '', `width=${width},height=${height},menubar=yes,location=no,resizable=yes,scrollbars=yes,status=yes`])
		// .delay(500)
		.getAllWindowHandles()
		.then(windows => this.switchToWindow(windows[windows.length - 1]))
}
