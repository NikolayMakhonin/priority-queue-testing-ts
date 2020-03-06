/* eslint-disable no-process-env */
module.exports = {
	appId      : 'com.priority-queues',
	packageName: 'priority-queues',
	appName    : 'App Template',
	appVersion : '0.0.1',
	description: 'App Template',
	logUrls    : [
		// 'http://priority-queues.logger.com/log.php', // TODO
	],
	installer  : {
		electronVersion: '6.0.11',
		nodeVersion    : '12.4.0',
	},
	sapper: {
		devServer: (process.env.NODE_ENV || '').trim() === 'development'
	},
	tests: {
		intern: {

		},
	},
}
