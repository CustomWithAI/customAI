export function defineString(value: string): number | boolean | string {
	const numberValue = Number(value);

	if (!Number.isNaN(numberValue)) {
		return numberValue;
	}

	if (value.toLowerCase() === "true") {
		return true;
	}
	if (value.toLowerCase() === "false") {
		return false;
	}
	return value;
}
