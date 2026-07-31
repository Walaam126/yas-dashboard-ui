export interface AddressParts {
	/** Free text — `Villa 21`, `Flat 402, Building 1204`. */
	building: string;
	road: string;
	block: string;
	area: string;
	extra?: string;
}

/** The Bahraini address order used everywhere in the dashboard. */
export function formatAddress(parts: AddressParts): string {
	return [
		parts.building.trim(),
		parts.road.trim() && `Road ${parts.road.trim()}`,
		parts.block.trim() && `Block ${parts.block.trim()}`,
		parts.area.trim(),
		parts.extra?.trim()
	]
		.filter(Boolean)
		.join(', ');
}

/** `33112244` → `+973 3311 2244`, so typed numbers read like the saved ones. */
export function formatBahrainPhone(local: string): string {
	const digits = local.replace(/\D/g, '');
	if (digits.length !== 8) return digits ? `+973 ${digits}` : '';
	return `+973 ${digits.slice(0, 4)} ${digits.slice(4)}`;
}

/** The short area line shown in customer search results. */
export function addressArea(address: string): string {
	const parts = address.split(',').map((part) => part.trim());
	return parts[parts.length - 1] ?? address;
}
