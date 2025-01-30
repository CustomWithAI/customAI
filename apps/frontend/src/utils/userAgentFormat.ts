export function getDeviceFromUserAgent(userAgent: string | undefined) {
	const devices = [
		{ name: "Macintosh", regex: /Macintosh/ },
		{ name: "Windows", regex: /Windows/ },
		{ name: "iPhone", regex: /iPhone/ },
		{ name: "iPad", regex: /iPad/ },
		{ name: "Android", regex: /Android/ },
		{ name: "Linux", regex: /Linux/ },
	];
	if (!userAgent) {
		return "Unknown Device";
	}
	for (const device of devices) {
		if (device.regex.test(userAgent)) {
			return device.name;
		}
	}

	return "Unknown Device";
}
