import { getDashboardSummary, getRecentOrders, getUpcomingTour, salesLast7Days } from '$lib/data';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	return {
		summary: getDashboardSummary(),
		recentOrders: getRecentOrders(5),
		upcomingTour: getUpcomingTour(),
		sales: salesLast7Days
	};
};
