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

export { bhd, countdownLabel, daysUntil, formatDate, toDateInputValue } from './utils/format';
export {
	customerStatusMap,
	deliveryMap,
	discountStatusMap,
	discountTypeMap,
	orderStatusMap,
	orderTypeMap,
	paymentMap,
	statusOptions,
	stockMap,
	tourStatusMap,
	visibilityMap
} from './utils/labels';
export { applyParams } from './utils/navigate';
export { activeFilterCount, param, withParams } from './utils/url-state';
