import type { Order, OrderItem } from '$lib/types';
import { IMAGES } from './images';

function item(
	id: string,
	name: string,
	brand: string,
	image: string,
	size: string,
	color: string,
	qty: number,
	price: number
): OrderItem {
	return { id, name, brand, image, size, color, qty, price };
}

export const orders: Order[] = [
	{
		id: 'o1',
		number: '#YAS-1042',
		customer: 'Fatima Al Khalifa',
		customerId: 'c1',
		phone: '+973 3311 2244',
		email: 'fatima.k@example.bh',
		type: 'ready',
		status: 'new',
		payment: 'paid',
		paymentMethod: 'BenefitPay',
		delivery: 'same_day',
		address: 'Villa 21, Road 2810, Block 428, Seef, Manama',
		items: [
			item(
				'i1',
				'Aurélie Structured Tote',
				'Aurélie Paris',
				IMAGES.bag,
				'One Size',
				'Tan',
				1,
				119.0
			),
			item(
				'i2',
				'Silk Scarf — Gold Weave',
				'Maison Ora',
				IMAGES.blazer,
				'One Size',
				'Gold',
				1,
				38.0
			)
		],
		subtotal: 157.0,
		discount: 10.0,
		deliveryFee: 2.0,
		total: 149.0,
		date: '2026-07-27',
		customerNote: 'Please gift wrap the tote.',
		activity: [
			{ label: 'Order placed', date: '27 Jul, 09:14', by: 'Customer' },
			{ label: 'Payment received', date: '27 Jul, 09:15', by: 'System' }
		]
	},
	{
		id: 'o2',
		number: '#YAS-1041',
		customer: 'Ahmed Al Dossari',
		customerId: 'c2',
		phone: '+973 3655 8890',
		email: 'a.dossari@example.bh',
		type: 'preorder',
		status: 'new',
		payment: 'partial',
		paymentMethod: 'Bank Transfer',
		delivery: 'delivery',
		address: 'Flat 402, Building 1204, Road 4127, Juffair',
		items: [item('i3', 'Camel Wool Blazer', 'Maison Ora', IMAGES.blazer, 'M', 'Camel', 1, 210.0)],
		subtotal: 210.0,
		discount: 0,
		deliveryFee: 2.0,
		total: 212.0,
		date: '2026-07-27',
		expectedDate: '2026-08-18',
		supplierRef: 'ORA-PO-8842',
		deposit: 106.0,
		remaining: 106.0,
		adminNote: 'Awaiting supplier confirmation on size M.',
		activity: [
			{ label: 'Pre-order placed', date: '27 Jul, 08:02', by: 'Customer' },
			{ label: 'Deposit received', date: '27 Jul, 08:03', by: 'System' }
		]
	},
	{
		id: 'o3',
		number: '#YAS-1040',
		customer: 'Noor Abdulla',
		customerId: 'c3',
		phone: '+973 3944 1177',
		email: 'noor.a@example.bh',
		type: 'tour',
		status: 'confirmed',
		payment: 'partial',
		paymentMethod: 'Cash on Delivery',
		delivery: 'pickup',
		address: 'Pickup — YAS Outlet, Seef Mall',
		items: [item('i4', 'Nude Leather Pump', 'Serena', IMAGES.heels, '38', 'Nude', 1, 132.0)],
		subtotal: 132.0,
		discount: 0,
		deliveryFee: 0,
		total: 132.0,
		date: '2026-07-26',
		expectedDate: '2026-08-05',
		tourName: 'Milan Summer Edit',
		deposit: 40.0,
		remaining: 92.0,
		activity: [
			{ label: 'Tour request placed', date: '26 Jul, 14:20', by: 'Customer' },
			{ label: 'Deposit received', date: '26 Jul, 14:22', by: 'System' },
			{ label: 'Request confirmed', date: '26 Jul, 16:40', by: 'Layla (Admin)' }
		]
	},
	{
		id: 'o4',
		number: '#YAS-1039',
		customer: 'Sara Hasan',
		customerId: 'c4',
		phone: '+973 3277 6543',
		email: 'sara.h@example.bh',
		type: 'ready',
		status: 'preparing',
		payment: 'paid',
		paymentMethod: 'Card',
		delivery: 'delivery',
		address: 'Villa 9, Road 55, Block 338, Umm Al Hassam',
		items: [
			item(
				'i5',
				'Heritage 991 Suede Runner',
				'New Balance',
				IMAGES.sneaker,
				'42',
				'Beige',
				1,
				89.0
			),
			item('i6', 'Kids Suede Sneaker', 'New Balance', IMAGES.sneaker, '30', 'Beige', 1, 45.0)
		],
		subtotal: 134.0,
		discount: 0,
		deliveryFee: 2.0,
		total: 136.0,
		date: '2026-07-26',
		activity: [
			{ label: 'Order placed', date: '26 Jul, 11:05', by: 'Customer' },
			{ label: 'Order confirmed', date: '26 Jul, 11:30', by: 'Layla (Admin)' },
			{ label: 'Preparing order', date: '26 Jul, 13:10', by: 'Layla (Admin)' }
		]
	},
	{
		id: 'o5',
		number: '#YAS-1038',
		customer: 'Yousef Al Mannai',
		customerId: 'c5',
		phone: '+973 3699 2010',
		email: 'yousef.m@example.bh',
		type: 'ready',
		status: 'ready_delivery',
		payment: 'paid',
		paymentMethod: 'BenefitPay',
		delivery: 'same_day',
		address: 'Flat 12, Building 88, Road 3801, Adliya',
		items: [
			item('i7', 'Mini Crossbody Bag', 'Aurélie Paris', IMAGES.bag, 'One Size', 'Black', 1, 68.0)
		],
		subtotal: 68.0,
		discount: 0,
		deliveryFee: 2.0,
		total: 70.0,
		date: '2026-07-25',
		activity: [
			{ label: 'Order placed', date: '25 Jul, 16:44', by: 'Customer' },
			{ label: 'Ready for delivery', date: '26 Jul, 09:00', by: 'Layla (Admin)' }
		]
	},
	{
		id: 'o6',
		number: '#YAS-1037',
		customer: 'Mariam Buhazza',
		customerId: 'c6',
		phone: '+973 3388 4521',
		email: 'mariam.b@example.bh',
		type: 'ready',
		status: 'out_delivery',
		payment: 'unpaid',
		paymentMethod: 'Cash on Delivery',
		delivery: 'delivery',
		address: 'Villa 3, Road 1207, Block 712, Riffa',
		items: [
			item(
				'i8',
				'Aurélie Structured Tote',
				'Aurélie Paris',
				IMAGES.bag,
				'One Size',
				'Black',
				1,
				145.0
			)
		],
		subtotal: 145.0,
		discount: 0,
		deliveryFee: 2.0,
		total: 147.0,
		date: '2026-07-25',
		activity: [
			{ label: 'Order placed', date: '25 Jul, 10:11', by: 'Customer' },
			{ label: 'Out for delivery', date: '26 Jul, 12:30', by: 'Courier' }
		]
	},
	{
		id: 'o7',
		number: '#YAS-1036',
		customer: 'Khalid Al Sayed',
		customerId: 'c7',
		phone: '+973 3900 7788',
		email: 'khalid.s@example.bh',
		type: 'ready',
		status: 'completed',
		payment: 'paid',
		paymentMethod: 'Card',
		delivery: 'pickup',
		address: 'Pickup — YAS Outlet, Seef Mall',
		items: [
			item('i9', 'Heritage 991 Suede Runner', 'New Balance', IMAGES.sneaker, '43', 'Grey', 1, 89.0)
		],
		subtotal: 89.0,
		discount: 9.0,
		deliveryFee: 0,
		total: 80.0,
		date: '2026-07-24',
		activity: [
			{ label: 'Order placed', date: '24 Jul, 15:00', by: 'Customer' },
			{ label: 'Completed', date: '24 Jul, 18:20', by: 'Layla (Admin)' }
		]
	},
	{
		id: 'o8',
		number: '#YAS-1035',
		customer: 'Layla Janahi',
		customerId: 'c8',
		phone: '+973 3255 9021',
		email: 'layla.j@example.bh',
		type: 'preorder',
		status: 'cancelled',
		payment: 'refunded',
		paymentMethod: 'Bank Transfer',
		delivery: 'delivery',
		address: 'Flat 7, Building 340, Road 15, Hamala',
		items: [item('i10', 'Men Leather Loafer', 'Serena', IMAGES.heels, '42', 'Brown', 1, 118.0)],
		subtotal: 118.0,
		discount: 0,
		deliveryFee: 2.0,
		total: 120.0,
		date: '2026-07-23',
		expectedDate: '2026-08-20',
		supplierRef: 'SER-PO-1190',
		deposit: 60.0,
		remaining: 0,
		adminNote: 'Cancelled at customer request — deposit refunded.',
		activity: [
			{ label: 'Pre-order placed', date: '23 Jul, 09:40', by: 'Customer' },
			{ label: 'Cancelled & refunded', date: '24 Jul, 10:00', by: 'Layla (Admin)' }
		]
	}
];

export function findOrder(id: string): Order | undefined {
	return orders.find((order) => order.id === id);
}

export function ordersForCustomer(customerId: string): Order[] {
	return orders.filter((order) => order.customerId === customerId);
}

export function ordersForTour(tourName: string): Order[] {
	return orders.filter((order) => order.tourName === tourName);
}
