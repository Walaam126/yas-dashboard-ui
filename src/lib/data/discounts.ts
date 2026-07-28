import type { Discount } from '$lib/types';

export const discounts: Discount[] = [
	{
		id: 'd1',
		name: 'Summer Sale',
		code: 'SUMMER15',
		type: 'percentage',
		value: '15%',
		used: 42,
		limit: 200,
		start: '2026-07-01',
		end: '2026-08-31',
		status: 'active'
	},
	{
		id: 'd2',
		name: 'First Order',
		code: 'WELCOME5',
		type: 'fixed',
		value: 'BHD 5.000',
		used: 88,
		limit: 500,
		start: '2026-01-01',
		end: '2026-12-31',
		status: 'active'
	},
	{
		id: 'd3',
		name: 'Bags Category',
		code: 'BAGS10',
		type: 'category',
		value: '10%',
		used: 0,
		limit: 100,
		start: '2026-08-05',
		end: '2026-08-20',
		status: 'scheduled'
	},
	{
		id: 'd4',
		name: 'Eid Promo',
		code: 'EID2026',
		type: 'promo',
		value: '20%',
		used: 150,
		limit: 150,
		start: '2026-03-20',
		end: '2026-04-05',
		status: 'expired'
	},
	{
		id: 'd5',
		name: 'VIP Loafers',
		code: 'LOAFER',
		type: 'product',
		value: 'BHD 15.000',
		used: 5,
		limit: 50,
		start: '2026-07-10',
		end: '2026-09-10',
		status: 'disabled'
	}
];

export function findDiscount(id: string): Discount | undefined {
	return discounts.find((discount) => discount.id === id);
}
