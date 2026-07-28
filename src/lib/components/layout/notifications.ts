import { getDashboardSummary, getUpcomingTour, products } from '$lib/data';
import { countdownLabel } from '$lib/utils';

export interface HeaderNotification {
	title: string;
	time: string;
}

/**
 * Derived from the same records the pages render, so a notification can never
 * disagree with the list it points at.
 */
export function getNotifications(): HeaderNotification[] {
	const summary = getDashboardSummary();
	const lowStock = products.find((product) => product.stockStatus === 'low_stock');
	const tour = getUpcomingTour();

	const newOrders =
		summary.newOrders === 1
			? '1 new order needs confirmation'
			: `${summary.newOrders} new orders need confirmation`;

	const items: HeaderNotification[] = [{ title: newOrders, time: '10 min ago' }];

	if (lowStock) {
		items.push({ title: `${lowStock.name} is low in stock`, time: '1 hr ago' });
	}

	if (tour) {
		items.push({
			title: `${tour.name} closes in ${countdownLabel(tour.orderDeadline).toLowerCase()}`,
			time: '2 hr ago'
		});
	}

	return items;
}
