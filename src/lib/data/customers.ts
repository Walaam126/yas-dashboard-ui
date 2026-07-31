import type { Customer } from '$lib/types';

export const customers: Customer[] = [
	{
		id: 'c1',
		name: 'Fatima Al Khalifa',
		phone: '+973 3311 2244',
		email: 'fatima.k@example.bh',
		orders: 12,
		spent: 1840.0,
		lastOrder: '2026-07-27',
		status: 'vip',
		addresses: ['Villa 21, Road 2810, Block 428, Seef, Manama'],
		notes: 'Prefers gift wrapping. Frequent tote buyer.'
	},
	{
		id: 'c2',
		name: 'Ahmed Al Dossari',
		phone: '+973 3655 8890',
		email: 'a.dossari@example.bh',
		orders: 4,
		spent: 620.0,
		lastOrder: '2026-07-27',
		status: 'active',
		addresses: ['Flat 402, Building 1204, Road 4127, Juffair']
	},
	{
		id: 'c3',
		name: 'Noor Abdulla',
		phone: '+973 3944 1177',
		email: 'noor.a@example.bh',
		orders: 2,
		spent: 264.0,
		lastOrder: '2026-07-26',
		status: 'active',
		addresses: ['Building 55, Road 12, Block 338, Adliya']
	},
	{
		id: 'c4',
		name: 'Sara Hasan',
		phone: '+973 3277 6543',
		email: 'sara.h@example.bh',
		orders: 1,
		spent: 136.0,
		lastOrder: '2026-07-26',
		status: 'new',
		addresses: ['Villa 9, Road 55, Block 338, Umm Al Hassam']
	},
	{
		id: 'c5',
		name: 'Yousef Al Mannai',
		phone: '+973 3699 2010',
		email: 'yousef.m@example.bh',
		orders: 6,
		spent: 910.0,
		lastOrder: '2026-07-25',
		status: 'active',
		addresses: ['Flat 12, Building 88, Road 3801, Adliya']
	},
	{
		id: 'c6',
		name: 'Mariam Buhazza',
		phone: '+973 3388 4521',
		email: 'mariam.b@example.bh',
		orders: 8,
		spent: 1120.0,
		lastOrder: '2026-07-25',
		status: 'vip',
		addresses: ['Villa 3, Road 1207, Block 712, Riffa']
	},
	{
		id: 'c7',
		name: 'Khalid Al Sayed',
		phone: '+973 3900 7788',
		email: 'khalid.s@example.bh',
		orders: 3,
		spent: 380.0,
		lastOrder: '2026-07-24',
		status: 'active',
		addresses: ['Building 210, Road 2409, Block 324, Manama']
	},
	{
		id: 'c8',
		name: 'Layla Janahi',
		phone: '+973 3255 9021',
		email: 'layla.j@example.bh',
		orders: 0,
		spent: 0,
		lastOrder: '—',
		status: 'inactive',
		addresses: ['Flat 7, Building 340, Road 15, Hamala']
	}
];

export function findCustomer(id: string): Customer | undefined {
	return customers.find((customer) => customer.id === id);
}

/**
 * Mock-only: a customer added while writing an order joins the in-memory
 * directory so the order's customer link resolves. Nothing is persisted.
 */
export function addCustomer(customer: Customer): Customer {
	customers.unshift(customer);
	return customer;
}

/** `c-9` — the next free id in the mock directory. */
export function nextCustomerId(): string {
	return `c-${customers.length + 1}`;
}
