<svelte:options accessors={true} />

<p count="{count}">Count: {count}</p>
<button on:click="{() => count++}">+1</button>

<!-- Default data -->
<script>
	import {test} from './test'

	// const x = {}
	// export const value = Array.from((Object.assign(x, {x: {y: [['test']]}}))?.x?.y)?.flatMap(o => o)?.[0]
	export let count = test ? test.length : test
</script>
