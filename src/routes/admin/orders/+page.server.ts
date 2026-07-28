import type { PageServerLoad } from './$types';
import { countOrdersPerTab, filterOrders, orderTabs } from '$lib/data/order-filters';
import { orders } from '$lib/data/orders';
import { param } from '$lib/utils';

export const load: PageServerLoad = ({ url }) => {
	const requestedTab = param(url, 'status', 'all');
	const tab = orderTabs.some((candidate) => candidate.key === requestedTab) ? requestedTab : 'all';

	const query = {
		tab,
		search: param(url, 'q', ''),
		type: param(url, 'type'),
		payment: param(url, 'payment'),
		delivery: param(url, 'delivery')
	};

	return {
		query,
		total: orders.length,
		tabCounts: countOrdersPerTab(orders),
		// Streamed (not awaited) so the page shell and tabs render immediately and
		// the table shows its skeleton until the rows arrive.
		results: Promise.resolve(filterOrders(orders, query))
	};
};
