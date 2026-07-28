import type {
	CustomerStatus,
	DeliveryMethod,
	DiscountStatus,
	DiscountType,
	OrderStatus,
	OrderType,
	PaymentStatus,
	StatusMeta,
	StockStatus,
	TourStatus,
	Visibility
} from '$lib/types';

export const orderStatusMap: Record<OrderStatus, StatusMeta> = {
	new: { label: 'New', tone: 'gold' },
	confirmed: { label: 'Confirmed', tone: 'blue' },
	preparing: { label: 'Preparing', tone: 'amber' },
	ready_delivery: { label: 'Ready for Delivery', tone: 'camel' },
	out_delivery: { label: 'Out for Delivery', tone: 'blue' },
	completed: { label: 'Completed', tone: 'green' },
	cancelled: { label: 'Cancelled', tone: 'red' }
};

export const orderTypeMap: Record<OrderType, StatusMeta> = {
	ready: { label: 'Ready to Ship', tone: 'green' },
	preorder: { label: 'Pre-order', tone: 'amber' },
	tour: { label: 'Tour', tone: 'gold' }
};

export const paymentMap: Record<PaymentStatus, StatusMeta> = {
	paid: { label: 'Paid', tone: 'green' },
	unpaid: { label: 'Unpaid', tone: 'red' },
	partial: { label: 'Partially Paid', tone: 'amber' },
	refunded: { label: 'Refunded', tone: 'neutral' }
};

export const deliveryMap: Record<DeliveryMethod, string> = {
	delivery: 'Delivery',
	pickup: 'Pickup',
	same_day: 'Same-day Delivery'
};

export const stockMap: Record<StockStatus, StatusMeta> = {
	in_stock: { label: 'In Stock', tone: 'green' },
	low_stock: { label: 'Low Stock', tone: 'amber' },
	out_stock: { label: 'Out of Stock', tone: 'red' },
	not_tracked: { label: 'Not Tracked', tone: 'neutral' }
};

export const visibilityMap: Record<Visibility, StatusMeta> = {
	published: { label: 'Published', tone: 'green' },
	draft: { label: 'Draft', tone: 'neutral' },
	hidden: { label: 'Hidden', tone: 'amber' }
};

export const tourStatusMap: Record<TourStatus, StatusMeta> = {
	draft: { label: 'Draft', tone: 'neutral' },
	open: { label: 'Open for Orders', tone: 'green' },
	closed: { label: 'Orders Closed', tone: 'amber' },
	shopping: { label: 'Shopping in Progress', tone: 'blue' },
	returning: { label: 'Returning', tone: 'camel' },
	completed: { label: 'Completed', tone: 'green' },
	cancelled: { label: 'Cancelled', tone: 'red' }
};

export const customerStatusMap: Record<CustomerStatus, StatusMeta> = {
	active: { label: 'Active', tone: 'green' },
	new: { label: 'New', tone: 'blue' },
	vip: { label: 'VIP', tone: 'gold' },
	inactive: { label: 'Inactive', tone: 'neutral' }
};

export const discountStatusMap: Record<DiscountStatus, StatusMeta> = {
	active: { label: 'Active', tone: 'green' },
	scheduled: { label: 'Scheduled', tone: 'blue' },
	expired: { label: 'Expired', tone: 'neutral' },
	disabled: { label: 'Disabled', tone: 'red' }
};

export const discountTypeMap: Record<DiscountType, string> = {
	percentage: 'Percentage',
	fixed: 'Fixed Amount',
	product: 'Product-specific',
	category: 'Category',
	promo: 'Promo Code'
};

/** Turn a `Record<Key, StatusMeta>` into `<option>`-friendly entries. */
export function statusOptions<K extends string>(
	map: Record<K, StatusMeta>
): { value: K; label: string }[] {
	return (Object.entries(map) as [K, StatusMeta][]).map(([value, meta]) => ({
		value,
		label: meta.label
	}));
}
