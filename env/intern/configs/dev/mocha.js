import config from './intern'
import {configure, runTests} from '../../mocha-helpers'

configure({
	...config,
	functionalSuites: [
		'src/test/*/webdriver/**/*.js',
		'!*/**/{src,assets}/**'
	],
})
runTests()
