export function extendJSONParser() {
	function dateParser(key: string, value: any) {
		if (typeof value === "string") {
			if (value.endsWith("Z")) {
				try {
					return new Date(value)
				} catch (err) {
					return value
				}
			}
		}
		return value
	}

	const _parse = JSON.parse

	JSON.parse = function (json: any) {
		return _parse(json, dateParser)
	}
}
