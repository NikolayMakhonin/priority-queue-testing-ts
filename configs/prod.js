/* tslint:disable:no-var-requires */
const base = require('./base')

module.exports = {
	// base
	appId      : `${base.appId}.app`,
	packageName: base.packageName,
	appName    : base.appName,
	appVersion : base.appVersion,
	logUrls    : base.logUrls,
	installer  : base.installer,

	type  : 'prod',
	tests : {
		intern: {
			staticPort: 3015,
			serverPort: 3025,
			socketPort: 3035,
		},
	},
	sapper: {
		buildMode: 'development',
		port     : base.sapper.devServer ? 3000 : 3005,
		devServer: base.sapper.devServer,
	},
}
