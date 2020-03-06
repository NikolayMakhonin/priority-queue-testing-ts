import {staticPort, appConfigType} from '../constants'

export default {
	plugins: [
		'env/intern/register-intern.js',
		// {
		// 	script : 'env/intern/modules/intern-express/index.js',
		// 	options: {
		// 		servers: [
		// 			{
		// 				port : staticPort,
		// 				inits: [['/app', `dist/${appConfigType}/sapper/export/app`]]
		// 			}
		// 		]
		// 	}
		// }
	]
}
