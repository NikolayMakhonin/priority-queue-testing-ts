import {ObjectPool} from '../../../../main/common/ObjectPool'
import {PairingHeap, PairingNode} from '../../../../main/common/PairingHeap'

declare const describe: any
declare const xdescribe: any
declare const it: any
declare const xit: any
declare const after: any
declare const assert: any

const objectPool = new ObjectPool<PairingNode<any, any>>(1000000)

function getMinIndex<TItem, TKey>(arr: Array<PairingNode<TItem, TKey>>): number {
	let min
	let minIndex
	for (let i = 0, len = arr.length; i < len; i++) {
		const item = arr[i]
		if (i === 0 || item.key < min) {
			min = item.key
			minIndex = i
		}
	}
	return minIndex
}

class PairingHeapTester<TItem, TKey> {
	private readonly _checkItems: Array<PairingNode<TItem, TKey>>
	private readonly _heap: PairingHeap<TItem, TKey>

	constructor() {
		this._heap = new PairingHeap(objectPool)
		this._checkItems = []
		this.check()
	}

	public check() {
		const {_heap, _checkItems} = this

		// check size
		assert.strictEqual(_heap.size, _checkItems.length)
	}

	public add(item: TItem, key: TKey) {
		const node = this._heap.add(item, key)
		assert.strictEqual(node.key, key)
		assert.strictEqual(node.item, item)
		this._checkItems.push(node)
		this.check()
	}

	public delete(node: PairingNode<TItem, TKey>) {
		const index = this._checkItems.indexOf(node)
		const checkKey = node.key
		if (index >= 0) {
			assert.ok(index < this._checkItems.length)
			assert.strictEqual(this._checkItems[index], node)
			this._checkItems.splice(index, 1)
		}
		
		const key = this._heap.delete(node)
		assert.strictEqual(key, checkKey)
		if (key == null) {
			assert.strictEqual(index, -1)
		} else {
			assert.ok(index >= 0)
		}

		this.check()
	}

	public deleteMin() {
		const index = getMinIndex(this._checkItems)
		const checkKey = index >= 0
			? this._checkItems[index].key
			: null
			
		const key = this._heap.deleteMin()
		assert.strictEqual(key, checkKey)
		
		if (key == null) {
			assert.strictEqual(this._checkItems.length, 0)
		} else {
			assert.ok(index < this._checkItems.length)
			this._checkItems.splice(index, 1)
		}

		this.check()
	}
}

describe('common > main > PairingHeap', function() {
	this.timeout(6000000)

	let totalTests = 0

	after(function() {
		console.log('Total BinaryTree tests >= ' + totalTests)
	})

	function testVariant(
		heap: PairingHeapTester<number, number>,
		addItems: number[],
		deleteIndexes: number[],
	) {
		try {
			const deleteNodes = []
			for (let i = 0, len = addItems.length; i < len; i++) {
				deleteNodes.push(heap.add(addItems[i], addItems[i]))
			}
			for (let i = 0, len = deleteNodes.length; i < len; i++) {
				heap.delete(deleteNodes[i])
			}
			heap.delete(deleteNodes[0])
			for (let i = 0, len = addItems.length; i < len; i++) {
				deleteNodes.push(heap.add(addItems[i], addItems[i]))
			}
			for (let i = 0, len = addItems.length; i < len; i++) {
				assert.strictEqual(heap.deleteMin(), i)
			}
			heap.deleteMin()
		} catch (ex) {
			console.log(`testsCount: ${totalTests}`)
			console.log(`addItems: ${addItems.join(',')}`)
			console.log(`deleteItems: ${deleteIndexes.join(',')}`)
			throw ex
		}
		totalTests++
	}

	it('add / delete random', function() {
		const heap = new PairingHeapTester<number, number>()
		const variants = [0, 1, 2, 3, 4, 5, 6]
		for (let i = 0; i < 10000; i++) {
			const addItems = variants.slice().sort(() => Math.random() > 0.5 ? 1 : -1)
			const deleteIndexes = variants.slice().sort(() => Math.random() > 0.5 ? 1 : -1)
			testVariant(
				heap,
				addItems,
				deleteIndexes,
			)
		}
	})
})
