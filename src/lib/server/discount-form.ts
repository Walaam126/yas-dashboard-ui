import type { DiscountFormValues } from '$lib/schemas';
import type { Discount } from '$lib/types';
import { toDateInputValue } from '$lib/utils';

/** Pull the numeric part out of a pre-formatted value like `15%` or `BHD 5.000`. */
function parseDisplayValue(value: string): number {
	const match = value.match(/[\d.]+/);
	return match ? Number(match[0]) : 0;
}

export function emptyDiscountForm(today = new Date()): DiscountFormValues {
	const inDays = (days: number) => {
		const date = new Date(today);
		date.setDate(date.getDate() + days);
		return toDateInputValue(date.toISOString());
	};

	return {
		name: '',
		code: '',
		type: 'percentage',
		value: 10,
		scope: 'all',
		minimumOrder: 0,
		usageLimit: 100,
		start: inDays(0),
		end: inDays(30),
		active: true
	};
}

export function discountToForm(discount: Discount): DiscountFormValues {
	return {
		name: discount.name,
		code: discount.code,
		type: discount.type,
		value: parseDisplayValue(discount.value),
		scope: 'all',
		minimumOrder: 0,
		usageLimit: discount.limit,
		start: toDateInputValue(discount.start),
		end: toDateInputValue(discount.end),
		active: discount.status === 'active'
	};
}
