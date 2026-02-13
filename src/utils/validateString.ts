export function validateString(value: unknown): value is string {
	return typeof value === "string" || value instanceof String;
}
