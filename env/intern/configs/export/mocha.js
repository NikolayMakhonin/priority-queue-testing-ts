import config from './intern'
import {configure, runTests} from '../../mocha-helpers'

configure({
	...config
})
runTests()
