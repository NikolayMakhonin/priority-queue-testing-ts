const w3cValidateHtmlUrl = 'https://validator.w3.org/nu/?out=json&group=1&parser=html'
const w3cValidateCssUrl = 'https://validator.w3.org/nu/?out=json&group=1&parser=css'
const w3cValidateSvgUrl = 'https://validator.w3.org/nu/?out=json&group=1&parser=svg'

export async function validateW3C(options) {
	let w3cValidatorUrl
	let contentType
	switch (options.type || 'html') {
		case 'css':
			w3cValidatorUrl = w3cValidateCssUrl
			contentType = 'text/css; charset=utf-8'
			break
		case 'html':
			w3cValidatorUrl = w3cValidateHtmlUrl
			contentType = 'text/html; charset=utf-8'
			break
		case 'svg':
			w3cValidatorUrl = w3cValidateSvgUrl
			contentType = 'image/svg+xml; charset=utf-8'
			break
		default:
			throw new Error(`Unknown source type: ${options.type}`)
	}

	const xhr = new XMLHttpRequest()
	xhr.timeout = options.timeout || 7000
	xhr.open('POST', w3cValidatorUrl)
	xhr.setRequestHeader('Content-Type', contentType)
	// xhr.setRequestHeader('User-Agent', 'Validator.nu/LV http://validator.w3.org/services')

	const responseJson = await new Promise((resolve, reject) => {
		xhr.ontimeout = function () {
			reject(`validateW3C: The request for ${w3cValidatorUrl} timed out.`)
		}
		xhr.onerror = function () {
			reject('validateW3C: Error during the request')
		}
		xhr.onreadystatechange = function () {
			if (this.readyState !== 4) {
				return
			}

			if (this.status !== 200) {
				reject(`validateW3C: An error occurred during your request: ${this.status}:${this.statusText}`)
				return
			}

			resolve(this.responseText)
		}

		xhr.send(options.content)
	})

	const response = JSON.parse(responseJson)

	const result = {}
	for (const message of response.messages) {
		const type = message.subType || message.type
		let messages = result[type]
		if (!messages) {
			result[type] = messages = []
		}
		messages.push(message)
	}

	return result
}

export default {
	validateW3C
}
