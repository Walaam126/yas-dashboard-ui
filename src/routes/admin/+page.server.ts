import type { PageServerLoad } from './$types';
import { getDashboardSummary, getRecentOrders, getUpcomingTour, salesLast7Days } from '$lib/data';

export const load: PageServerLoad = () => {
	return {
		summary: getDashboardSummary(),
		upcomingTour: getUpcomingTour(),
		// Secondary panels are streamed so the headline figures paint first and
		// each panel shows its own skeleton until its data arrives.
		recentOrders: Promise.resolve(getRecentOrders(5)),
		sales: Promise.resolve(salesLast7Days)
	};
};
