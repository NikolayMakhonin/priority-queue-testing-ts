// @ts-ignore
import {calcPerformance} from 'rdtsc'
import {assert} from 'webrain/dist/js/main/common/test/Assert'
import {CalcType} from 'webrain/dist/js/main/common/test/calc'
import {calcMemAllocate} from 'webrain/dist/js/main/common/test/calc-mem-allocate'
import {describe, it} from 'webrain/dist/js/main/common/test/Mocha'
import {ObjectPool} from '../../../main/common/ObjectPool'
import {PairingHeap, PairingNode} from '../../../main/common/PairingHeap'

describe('PairingHeap perf', function() {
	const objectPool = new ObjectPool<PairingNode<any, any>>(1000000)

	it('add / delete', function() {
		this.timeout(300000)

		const binaryTree = new PairingHeap<number, number>(objectPool)
		const addItems = [6, 1, 5, 3, 0, 4, 2]

		const len = addItems.length

		const result = calcPerformance(
			10000,
			() => {
				// empty
				for (let i = 0; i < len; i++) {
					const item = addItems[i]
				}
			}, () => { // 333
				for (let i = 0; i < len; i++) {
					const item = addItems[i]
					binaryTree.add(item, item)
				}
			}, () => { // 7
				for (let i = 0; i < len; i++) {
					const item = addItems[i]
					binaryTree.getMin()
				}
			}, () => { // 555
				for (let i = 0; i < len; i++) {
					const item = addItems[i]
					binaryTree.deleteMin()
				}
			},
		)

		console.log(result)
	})

	it('add / delete memory', function() {
		this.timeout(300000)

		const binaryTree = new PairingHeap<number, number>(objectPool)
		const addItems = [6, 1, 5, 3, 0, 4, 2]
		const len = addItems.length

		const result = calcMemAllocate(CalcType.Min, 2000, () => {
			for (let i = 0; i < len; i++) {
				const item = addItems[i]
				binaryTree.add(item, item)
			}
			for (let i = 0; i < len; i++) {
				binaryTree.getMin()
				binaryTree.deleteMin()
			}
		})

		console.log(result.toString())

		result.averageValue.forEach(o => assert.ok(o <= 0))
	})
})
