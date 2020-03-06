/* eslint-disable function-paren-newline */
import {getDebugInfo} from './get-debug-info'
import w3c from './w3c'
import {load, getHtml} from './load'

async function validateSingle(resource) {
	if (!resource || !resource.url) {
		return null
	}

	if (!resource.content) {
		try {
			const response = await load('GET', resource.url, null)
			resource.content = response.responseText
		} catch (ex) {
			resource.error = `Error load ${resource.url}:\r\n${ex}\r\n${ex.stack}` || ex.toString()
		}
	}

	if (!resource.type) {
		const urlInfo = new URL(resource.url)
		const matchExt = urlInfo.pathname.match(/\.(?:\w+)$/)
		const ext = matchExt ? matchExt[0] : ''
		switch (ext) {
			case '.css':
				resource.type = 'css'
				break
			case '.svg':
				resource.type = 'svg'
				break
			case '.htm':
			case '.html':
			default:
				resource.type = 'html'
				break
		}
	}

	try {
		resource.w3c = await w3c.validateW3C({
			content: resource.content,
			type   : resource.type
		})
	} catch (ex) {
		resource.error = `Error get w3c validate report for content of ${resource.url}:\r\n${ex}\r\n${ex.stack}` || ex.toString()
	}

	return resource
}

export async function validateAll(urlRegex) {
	if (urlRegex) {
		urlRegex = urlRegex instanceof RegExp
			? urlRegex
			: new RegExp(urlRegex, 'i')
	}

	const resources = getDebugInfo().resources || []

	// console.log(`validate resources[${resources.length}]`)

	const results = (await Promise.all(
		[
			{
				type   : 'html',
				url    : document.location.href + '.html',
				content: getHtml()
			},
			...resources,
		]
			.filter(o => o && o.url && (!urlRegex || o.url.match(urlRegex)))
			.map(res => validateSingle(res))
	))
		.filter(o => o)

	const total = results.length
	const withErrors = results
		.filter(o => o.error || !o.w3c || (o.w3c.error || o.w3c.warning))

	return {
		total,
		withErrors
	}
}

export default {
	validateAll
}
