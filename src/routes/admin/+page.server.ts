import type { PageServerLoad } from './$types';
import { getDashboardSummary, getRecentOrders, getUpcomingTour, salesLast7Days } from '$lib/data';

export const load: PageServerLoad = () => {
	return {
		summary: getDashboardSummary(),
		recentOrders: getRecentOrders(5),
		upcomingTour: getUpcomingTour(),
		sales: salesLast7Days
	};
};
