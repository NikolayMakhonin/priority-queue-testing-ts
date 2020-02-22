/* eslint-disable no-process-env */
module.exports = {
	appId      : 'com.app-template',
	packageName: 'app-template',
	appName    : 'App Template',
	appVersion : '0.0.1',
	description: 'App Template',
	logUrl     : 'http://app-template.logger.com/log.php',
	installer  : {
		electronVersion: '6.0.11',
		nodeVersion    : '12.4.0',
	},
	sapper: {
		devServer: (process.env.NODE_ENV || '').trim() === 'development'
	},
	tests: {
		intern: {
			serverIp: '192.168.0.102',
		},
	},
}
