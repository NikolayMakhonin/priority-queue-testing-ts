/* eslint-disable no-undefined,no-global-assign,no-undef,no-var,vars-on-top */
/* eslint prefer-template: "off" */
/* eslint-env es5 */
/* eslint semi: ["error", "always"] */
// (function () {
// 	if (typeof navigator === 'undefined') {
// 		return;
// 	}
//
// 	// see: https://stackoverflow.com/a/16136040/5221762
// 	function getIeVersion() {
// 		var match = navigator.userAgent.match(/msie\s*(\d+)/);
// 		if (!match) {
// 			return null;
// 		}
// 		return parseInt(match[1], 10);
// 	}
//
// 	var ieVersion = getIeVersion();
//
// 	if (ieVersion && ieVersion <= 10) {
// 		Uint8Array = undefined;
// 	}
// })();

// import 'core-js/es6/set'
// import 'core-js/es6/map'
// import 'core-js/modules/es7.array.includes'
// import 'core-js/modules/es6.array.from'
// import 'core-js/fn/promise/finally'
// import 'core-js/modules/es6.string.starts-with'
// import 'core-js/modules/es6.object.assign'
// import 'core-js/modules/es6.symbol'
// import 'core-js/modules/es6.number.max-safe-integer'
// import 'core-js/modules/es6.number.min-safe-integer'
// import 'core-js/modules/es7.array.flat-map'
// Used @babel/runtime corejs option instead

// import 'shimport'
// import '@webcomponents/webcomponentsjs'

// for shimport:
window.Map = Map
window.Array.from = Array.from
// window.Object.getOwnPropertyNames = Object.getOwnPropertyNames
// Array.from = Array.from
// Object.getOwnPropertyNames = Object.getOwnPropertyNames
