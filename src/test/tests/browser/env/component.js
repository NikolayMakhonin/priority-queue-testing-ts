import Component from './src/component.svelte'

describe('browser > env > component', function () {
	let testElem

	beforeEach(() => {
		testElem = document.createElement('test')
		document.body.appendChild(testElem)
	})

	function createComponent(props) {
		return new Component({
			target: document.querySelector('test'),
			props  : {...props},
		})
	}

	it('should initialize the count when no data is given', () => {
		const component = createComponent()
		assert.strictEqual(component.count, 4)
		// assert.strictEqual(component.value, 4)
	})

	it('should start the count with given data', () => {
		const component = createComponent({count: 5})
		assert.strictEqual(component.count, 5)
		// assert.strictEqual(component.value, 4)
	})
})
