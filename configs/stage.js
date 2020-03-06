/* tslint:disable:no-var-requires */
const base = require('./base')

module.exports = {
	// base
	appId      : `${base.appId}.stage`,
	packageName: `${base.packageName}-stage`,
	appName    : `${base.appName} Stage`,
	appVersion : `${base.appVersion}`,
	logUrls    : base.logUrls,
	installer  : base.installer,

	type  : 'stage',
	dev   : {
		devPage : false,
		devTools: {
			openAtStart: false,
		},
	},
	tests: {
		intern: {
			staticPort: 3013,
			serverPort: 3023,
			socketPort: 3033,
		},
	},
	sapper: {
		buildMode: 'development',
		port     : base.sapper.devServer ? 3000 : 3003,
		devServer: base.sapper.devServer,
	},
}
