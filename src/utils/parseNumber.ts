export function parseNumber(value: unknown, fallback: number): number {
	const parsed = Number(value);
	return Number.isInteger(parsed) ? parsed : fallback;
}
