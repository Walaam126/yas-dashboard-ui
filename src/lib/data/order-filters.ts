import type { Order } from '$lib/types';

export interface OrderTab {
	key: string;
	label: string;
	match: (order: Order) => boolean;
}

export const orderTabs: OrderTab[] = [
	{ key: 'all', label: 'All', match: () => true },
	{ key: 'new', label: 'New', match: (order) => order.status === 'new' },
	{
		key: 'progress',
		label: 'In Progress',
		match: (order) => order.status === 'confirmed' || order.status === 'preparing'
	},
	{
		key: 'ready',
		label: 'Ready for Delivery',
		match: (order) => order.status === 'ready_delivery' || order.status === 'out_delivery'
	},
	{ key: 'completed', label: 'Completed', match: (order) => order.status === 'completed' },
	{ key: 'cancelled', label: 'Cancelled', match: (order) => order.status === 'cancelled' }
];

export const ORDER_FILTER_KEYS = ['type', 'payment', 'delivery'] as const;

export interface OrderQuery {
	tab: string;
	search: string;
	type: string;
	payment: string;
	delivery: string;
}

/** Apply the tab, the three dropdown filters and the free-text search. */
export function filterOrders(orders: Order[], query: OrderQuery): Order[] {
	const tab = orderTabs.find((candidate) => candidate.key === query.tab) ?? orderTabs[0];
	const needle = query.search.trim().toLowerCase();

	return orders.filter((order) => {
		if (!tab.match(order)) return false;
		if (query.type !== 'all' && order.type !== query.type) return false;
		if (query.payment !== 'all' && order.payment !== query.payment) return false;
		if (query.delivery !== 'all' && order.delivery !== query.delivery) return false;
		if (needle) {
			const haystack = `${order.number} ${order.customer}`.toLowerCase();
			if (!haystack.includes(needle)) return false;
		}
		return true;
	});
}

export function countOrdersPerTab(orders: Order[]): Record<string, number> {
	return Object.fromEntries(orderTabs.map((tab) => [tab.key, orders.filter(tab.match).length]));
}
