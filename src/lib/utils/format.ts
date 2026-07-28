/** Bahraini Dinar is a three-decimal currency — always render all three. */
export function bhd(amount: number): string {
	if (!Number.isFinite(amount)) return 'BHD 0.000';
	return `BHD ${amount.toFixed(3)}`;
}

const PLACEHOLDER = '—';

/**
 * Format an ISO date for display. Unparseable input is returned untouched so a
 * placeholder such as `—` in the mock data survives the round trip.
 */
export function formatDate(iso: string | null | undefined): string {
	if (!iso || iso === PLACEHOLDER) return PLACEHOLDER;
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return iso;
	return date.toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	});
}

/**
 * Whole days between now and the given date. Negative when the date has passed,
 * `null` when the date cannot be parsed.
 */
export function daysUntil(iso: string | null | undefined, from: Date = new Date()): number | null {
	if (!iso || iso === PLACEHOLDER) return null;
	const target = new Date(iso);
	if (Number.isNaN(target.getTime())) return null;
	const startOfDay = (d: Date) => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
	return Math.round((startOfDay(target) - startOfDay(from)) / 86_400_000);
}

/** Human phrasing for a countdown, e.g. `6 days`, `today`, `closed`. */
export function countdownLabel(iso: string | null | undefined, from: Date = new Date()): string {
	const days = daysUntil(iso, from);
	if (days === null) return PLACEHOLDER;
	if (days < 0) return 'Closed';
	if (days === 0) return 'Today';
	return `${days} ${days === 1 ? 'day' : 'days'}`;
}

/** `2026-07-28` — the value shape an `<input type="date">` expects. */
export function toDateInputValue(iso: string | null | undefined): string {
	if (!iso || iso === PLACEHOLDER) return '';
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return '';
	return date.toISOString().slice(0, 10);
}
