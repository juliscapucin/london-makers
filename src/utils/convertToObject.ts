export function convertToSimpleObject<T extends Record<string, unknown>>(
	data: T
): T {
	const result = { ...data }

	for (const key of Object.keys(result) as (keyof T)[]) {
		const value = result[key]

		// Convert MongoDB ObjectId or Date-like objects
		if (
			value &&
			typeof value === 'object' &&
			'toJSON' in value &&
			'toString' in value
		) {
			// @ts-expect-error value is being stringified intentionally
			result[key] = (value as { toString(): string }).toString()
		}
	}

	return result
}
