import type { SalesPoint } from '$lib/types';
import { orders } from './orders';
import { products } from './products';
import { tours } from './tours';

export const salesLast7Days: SalesPoint[] = [
	{ day: 'Mon', value: 420 },
	{ day: 'Tue', value: 380 },
	{ day: 'Wed', value: 560 },
	{ day: 'Thu', value: 490 },
	{ day: 'Fri', value: 720 },
	{ day: 'Sat', value: 880 },
	{ day: 'Sun', value: 640 }
];

/** Statuses that still need the store owner to do something. */
const AWAITING_ACTION = new Set(['new', 'confirmed', 'preparing']);

export interface DashboardSummary {
	todaySales: number;
	salesDeltaPercent: number;
	newOrders: number;
	awaitingAction: number;
	lowStock: number;
	preordersAwaitingSupplier: number;
}

/**
 * Every headline figure is derived from the same mock records the list pages
 * render, so a card and the page it links to can never disagree.
 */
export function getDashboardSummary(): DashboardSummary {
	const today = salesLast7Days.at(-1)?.value ?? 0;
	const yesterday = salesLast7Days.at(-2)?.value ?? 0;

	return {
		todaySales: today,
		salesDeltaPercent: yesterday === 0 ? 0 : Math.round(((today - yesterday) / yesterday) * 100),
		newOrders: orders.filter((order) => order.status === 'new').length,
		awaitingAction: orders.filter((order) => AWAITING_ACTION.has(order.status)).length,
		lowStock: products.filter((product) => product.stockStatus === 'low_stock').length,
		preordersAwaitingSupplier: orders.filter(
			(order) => order.type === 'preorder' && AWAITING_ACTION.has(order.status)
		).length
	};
}

export function getRecentOrders(count = 5) {
	return orders.slice(0, count);
}

export function getUpcomingTour() {
	return tours.find((tour) => tour.status === 'open');
}
