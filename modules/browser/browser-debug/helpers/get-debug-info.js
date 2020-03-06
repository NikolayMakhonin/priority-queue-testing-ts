/* eslint-disable no-extra-parens,prefer-destructuring */

export function getDebugInfo() {
	if (typeof window === 'undefined') {
		return null
	}

	const result = {
		userAgent: navigator.userAgent
	}

	// performance.timing (deprecated)
	// https://www.w3.org/TR/navigation-timing/
	// Performance.timeOrigin (new)
	// https://w3c.github.io/navigation-timing/
	let timing = performance.getEntriesByType && performance.getEntriesByType('navigation')[0]
		|| performance.getEntries && performance.getEntries().filter(o => o.entryType === 'navigation')[0]

	if (timing) {
		result.timing = {
			loadHtml : timing.domInteractive,
			loadDom  : timing.loadEventEnd - timing.domInteractive,
			loadTotal: timing.loadEventEnd
		}
	} else if ((timing = performance.timing)) {
		result.timing = {
			loadHtml : timing.domInteractive - timing.navigationStart,
			loadDom  : timing.loadEventEnd - timing.domInteractive,
			loadTotal: timing.loadEventEnd - timing.navigationStart
		}
	}

	// Only for Chrome
	// https://webplatform.github.io/docs/apis/timing/properties/memory/
	if (performance.memory && performance.memory.usedJSHeapSize) {
		result.memory = {
			used: performance.memory.usedJSHeapSize
		}
	}

	// var resources = performance.getEntriesByType && performance.getEntriesByType('resource') ||
	// 	performance.getEntries && performance.getEntries().filter(o => o.entryType === 'resource')

	const resources = performance.getEntries && performance.getEntries()

	if (resources) {
		result.resources = resources
			.map(o => {
				const resource = {
					url: o.name
				}

				const time = o.responseEnd && (o.domainLookupStart || o.startTime || o.fetchStart)
					? o.responseEnd - (o.domainLookupStart || o.startTime || o.fetchStart)
					: o.duration

				if (time != null) {
					resource.time = time
				}

				if (o.initiatorType) {
					resource.initiator = o.initiatorType
				}

				const size = o.transferSize || o.encodedBodySize

				if (size) {
					resource.size = size
				}

				return resource
			})
			.sort((o1, o2) => {
				let i
				if ((i = (o2.size || 0) - (o1.size || 0)) !== 0) {
					return i
				}

				return (o2.time || 0) - (o1.time || 0)
			})
	}

	return result
}

export default {
	getDebugInfo
}
