export function load(method, url, data) {
	const xmlhttp = new XMLHttpRequest()
	xmlhttp.open(method, url, true)
	return new Promise((resolve, reject) => {
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState === 4) {
				if (xmlhttp.status < 400) {
					resolve(xmlhttp)
					return
				}

				reject(xmlhttp)
				return
			}
		}
		xmlhttp.send(data)
	})
}

export function getHtml(win) {
	return new XMLSerializer().serializeToString((win || window).document)
}

export default {
	load,
	getHtml
}
