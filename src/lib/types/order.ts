export type OrderType = 'ready' | 'preorder' | 'tour';

export type OrderStatus =
	| 'new'
	| 'confirmed'
	| 'preparing'
	| 'ready_delivery'
	| 'out_delivery'
	| 'completed'
	| 'cancelled';

export type PaymentStatus = 'paid' | 'unpaid' | 'partial' | 'refunded';

export type DeliveryMethod = 'delivery' | 'pickup' | 'same_day';

export interface OrderItem {
	id: string;
	name: string;
	brand: string;
	image: string;
	size: string;
	color: string;
	qty: number;
	price: number;
}

export interface OrderActivity {
	label: string;
	date: string;
	by: string;
}

export interface Order {
	id: string;
	number: string;
	customer: string;
	customerId: string;
	phone: string;
	email: string;
	type: OrderType;
	status: OrderStatus;
	payment: PaymentStatus;
	paymentMethod: string;
	delivery: DeliveryMethod;
	address: string;
	items: OrderItem[];
	subtotal: number;
	discount: number;
	deliveryFee: number;
	total: number;
	date: string;
	customerNote?: string;
	adminNote?: string;
	activity: OrderActivity[];
	/** Pre-order and tour specifics. */
	expectedDate?: string;
	supplierRef?: string;
	deposit?: number;
	remaining?: number;
	tourName?: string;
}
