const Command = require('@theintern/leadfoot/Command').default

/* eslint-disable */

function remoteLoadScript(scriptUrl, callback) {
	try {
		var script = window.document.createElement('script');
		script.onload = function () {
			callback();
		};
		script.onerror = function (err) {
			var errStr = err && err.stack || err && err.toString() || err + ''
			console.error(errStr);
			callback(errStr);
		};
		script.src = scriptUrl;
		document.head.appendChild(script);
	} catch (ex) {
		callback(JSON.stringify({
			error: {
				url: scriptUrl,
				message: ex.toString(),
				stack: ex.stack
			}
		}));
	}
}

/* eslint-enable */

Command.prototype.loadScript = function (scriptUrl, timeOut) {
	return this
		.setExecuteAsyncTimeout(timeOut || 10000)
		.executeAsync(remoteLoadScript, [scriptUrl])
		.end()
}
