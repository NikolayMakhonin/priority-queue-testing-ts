require('./load-script')
const intern = require('intern').default
const {assert} = intern.getPlugin('chai')

const {getComponentName, getComponentUrl} = require('../../rollup/helpers')

const Command = require('@theintern/leadfoot/Command').default

/* eslint-disable */

function appendSvelteComponent(componentClass, containerCssClass, props, callback) {
	try {
		var container = document.createElement('div');
		container.className = containerCssClass;
		document.body.appendChild(container);

		var component = new window[componentClass]({
			target: container,
			props
		});

		callback();
	} catch (ex) {
		callback(JSON.stringify({
			containerCssClass: containerCssClass,
			componentClass: componentClass,
			props: props,
			error: {
				message: ex.toString(),
				stack: ex.stack
			}
		}));
	}
}

/* eslint-enable */

Command.prototype.appendSvelteComponent = function (componentConcatPaths, containerCssClass, props, timeOut) {
	const componentName = getComponentName(...componentConcatPaths)
	return this
		.loadScript(getComponentUrl(...componentConcatPaths), timeOut)
		.executeAsync(appendSvelteComponent, [componentName, containerCssClass, props], timeOut || 10000)
		.then(err => {
			assert.isNotOk(err)
		})
		.end()
}
