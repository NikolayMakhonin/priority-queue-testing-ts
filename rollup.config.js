/* eslint-disable global-require,object-property-newline */
import config from 'sapper/config/rollup.js'
import pkg from './package.json'
const rollupPlugins = require('./env/rollup/plugins')

const dev = true // mode === 'development'
const legacy = true // dev || !!process.env.SAPPER_LEGACY_BUILD
const onwarn = (warning, nextOnWarn) => (warning.code === 'CIRCULAR_DEPENDENCY'
		&& /[/\\]@sapper[/\\]/.test(warning.message))
	|| nextOnWarn(warning)

export default {
	client: {
		input  : config.client.input(),
		output : config.client.output(),
		plugins: rollupPlugins.client({dev, legacy}),
		onwarn,
	},

	server: {
		input   : config.server.input(),
		output  : config.server.output(),
		plugins : rollupPlugins.server({dev, legacy}),
		external: Object.keys(pkg.dependencies)
			.concat(require('module').builtinModules || Object.keys(process.binding('natives'))),
		onwarn,
	},

	serviceworker: {
		input  : config.serviceworker.input(),
		output : config.serviceworker.output(),
		plugins: rollupPlugins.serviceworker({dev, legacy}),
		onwarn,
	}
}
