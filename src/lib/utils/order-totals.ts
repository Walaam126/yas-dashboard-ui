import type { DeliveryMethod } from '$lib/types';

export type DiscountKind = 'none' | 'fixed' | 'percentage';

/** The default delivery fee offered by the store, in BHD. */
export const DEFAULT_DELIVERY_FEE = 2;

export interface PricedLine {
	qty: number;
	price: number;
}

export interface OrderTotalsInput {
	items: PricedLine[];
	discountKind: DiscountKind;
	discountValue: number;
	deliveryMethod: DeliveryMethod;
	deliveryFee: number;
	adjustment: number;
}

export interface OrderTotals {
	/** Total pieces, not distinct products. */
	itemCount: number;
	subtotal: number;
	discount: number;
	deliveryFee: number;
	adjustment: number;
	total: number;
}

/** The Dinar is a three-decimal currency, so every intermediate stays rounded. */
function round3(value: number): number {
	return Number.isFinite(value) ? Math.round(value * 1000) / 1000 : 0;
}

function safe(value: number): number {
	return Number.isFinite(value) ? value : 0;
}

/** What the discount fields come to against a given subtotal, never more than it. */
export function discountAmount(kind: DiscountKind, value: number, subtotal: number): number {
	const entered = Math.max(safe(value), 0);
	if (kind === 'none' || entered === 0) return 0;
	const raw = kind === 'percentage' ? (subtotal * Math.min(entered, 100)) / 100 : entered;
	return round3(Math.min(raw, subtotal));
}

/**
 * The single source of truth for order money. The schema, the summary card and
 * the created order all run through here so they can never disagree.
 */
export function orderTotals(input: OrderTotalsInput): OrderTotals {
	const itemCount = input.items.reduce((sum, line) => sum + Math.max(safe(line.qty), 0), 0);
	const subtotal = round3(
		input.items.reduce(
			(sum, line) => sum + Math.max(safe(line.qty), 0) * Math.max(safe(line.price), 0),
			0
		)
	);

	const discount = discountAmount(input.discountKind, input.discountValue, subtotal);
	// Nothing is delivered on a pickup, so the fee never applies to one.
	const deliveryFee =
		input.deliveryMethod === 'pickup' ? 0 : round3(Math.max(safe(input.deliveryFee), 0));
	const adjustment = round3(safe(input.adjustment));

	return {
		itemCount,
		subtotal,
		discount,
		deliveryFee,
		adjustment,
		total: round3(Math.max(subtotal - discount + deliveryFee + adjustment, 0))
	};
}
