import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * `$lib/utils` is the alias shadcn-svelte writes into every registry component,
 * so this module owns `cn` and the registry's type helpers. The app's own
 * helpers live in `./utils/` and are re-exported here, which keeps the existing
 * `import { bhd } from '$lib/utils'` call sites working.
 */

/** Merge conditional class names, resolving conflicting Tailwind utilities. */
export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}

export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export type { AddressParts } from './utils/address';
export { addressArea, formatAddress, formatBahrainPhone } from './utils/address';
export { bhd, countdownLabel, daysUntil, formatDate, toDateInputValue } from './utils/format';
export {
	customerStatusMap,
	deliveryChoiceMap,
	deliveryMap,
	discountStatusMap,
	discountTypeMap,
	orderStatusMap,
	orderTypeMap,
	paymentMap,
	paymentMethodMap,
	statusOptions,
	stockMap,
	timeSlotMap,
	tourStatusMap,
	visibilityMap
} from './utils/labels';
export { applyParams } from './utils/navigate';
export type { ChosenCustomer } from './utils/order-review';
export { chosenCustomer, nextStepMessage } from './utils/order-review';
export type { DiscountKind, OrderTotals, OrderTotalsInput } from './utils/order-totals';
export { DEFAULT_DELIVERY_FEE, discountAmount, orderTotals } from './utils/order-totals';
export { activeFilterCount, param, withParams } from './utils/url-state';
