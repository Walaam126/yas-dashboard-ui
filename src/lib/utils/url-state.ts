/** Values that mean "no filter applied" and are therefore dropped from the URL. */
const EMPTY_VALUES = new Set(['', 'all']);

/** Read a search parameter, falling back to `all` so filters have a stable value. */
export function param(url: URL, key: string, fallback = 'all'): string {
	return url.searchParams.get(key) ?? fallback;
}

/**
 * Build a new URL string with the given search-parameter updates applied.
 * Empty / `all` values are removed so shareable URLs stay tidy.
 */
export function withParams(url: URL, updates: Record<string, string | null>): string {
	const next = new URL(url);
	for (const [key, value] of Object.entries(updates)) {
		if (value === null || EMPTY_VALUES.has(value)) {
			next.searchParams.delete(key);
		} else {
			next.searchParams.set(key, value);
		}
	}
	return `${next.pathname}${next.search}`;
}

/** Number of filters currently narrowing the list, used for the mobile badge. */
export function activeFilterCount(url: URL, keys: readonly string[]): number {
	return keys.filter((key) => {
		const value = url.searchParams.get(key);
		return value !== null && !EMPTY_VALUES.has(value);
	}).length;
}
