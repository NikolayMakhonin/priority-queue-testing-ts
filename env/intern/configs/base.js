import {serverIp, staticPort, serverPort, socketPort} from './constants'

export default {
	environments: [
		{
			browserName           : 'chrome',
			version               : '33',
			fixSessionCapabilities: 'no-detect', // improve performance
			chromeOptions         : {
				args: [
					'--no-sandbox',
					'--headless',
					'--incognito',
					`--unsafely-treat-insecure-origin-as-secure=http://${serverIp}:${staticPort}`,
					`--unsafety-treat-insecure-origin-as-secure=http://${serverIp}:${staticPort}`,
					'--enable-precise-memory-info'
				]
			}
		},
		{
			browserName           : 'chrome',
			version               : '37',
			fixSessionCapabilities: 'no-detect',
			chromeOptions         : {
				args: [
					'--no-sandbox',
					'--headless',
					'--incognito',
					`--unsafely-treat-insecure-origin-as-secure=http://${serverIp}:${staticPort}`,
					`--unsafety-treat-insecure-origin-as-secure=http://${serverIp}:${staticPort}`,
					'--enable-precise-memory-info'
				]
			}
		},
		{
			browserName           : 'chrome',
			version               : '39',
			fixSessionCapabilities: 'no-detect',
			chromeOptions         : {
				args: [
					'--no-sandbox',
					'--headless',
					'--incognito',
					`--unsafely-treat-insecure-origin-as-secure=http://${serverIp}:${staticPort}`,
					`--unsafety-treat-insecure-origin-as-secure=http://${serverIp}:${staticPort}`,
					'--enable-precise-memory-info'
				]
			}
		},
		{
			browserName           : 'chrome',
			version               : '44',
			fixSessionCapabilities: 'no-detect',
			chromeOptions         : {
				args: [
					'--no-sandbox',
					'--headless',
					'--incognito',
					`--unsafely-treat-insecure-origin-as-secure=http://${serverIp}:${staticPort}`,
					`--unsafety-treat-insecure-origin-as-secure=http://${serverIp}:${staticPort}`,
					'--enable-precise-memory-info'
				]
			}
		},
		{
			browserName           : 'chrome',
			version               : '52',
			fixSessionCapabilities: 'no-detect',
			chromeOptions         : {
				args: [
					'--no-sandbox',
					'--headless',
					'--incognito',
					`--unsafely-treat-insecure-origin-as-secure=http://${serverIp}:${staticPort}`,
					`--unsafety-treat-insecure-origin-as-secure=http://${serverIp}:${staticPort}`,
					'--enable-precise-memory-info'
				]
			}
		},
		{
			browserName: 'firefox'
		},
		{
			browserName : 'opera',
			operaOptions: {binary: '/usr/bin/opera'}
		}
	],

	tunnel       : 'null',
	tunnelOptions: {
		pathname: '/wd/hub',
		hostname: 'selenoid',
		port    : 4444,
		logLevel: 'trace'
	},
	capabilities: {
		'idle-timeout': 60000,
	},

	serverPort,
	socketPort,
	serverUrl: `http://${serverIp}:${serverPort}`,

	functionalSuites: [
		'src/test/*/webdriver/**/*.js',
		'!*/**/{src,assets}/**'
	],

	coverage: false,

	bail     : true, // stop testing after the first failure
	debug    : true,
	reporters: ['runner'],

	plugins: ['env/intern/register-intern.js']
}
