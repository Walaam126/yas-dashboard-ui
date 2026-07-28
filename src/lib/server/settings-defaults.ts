import type {
	DeliverySettingsValues,
	NotificationSettingsValues,
	OrderSettingsValues,
	PaymentSettingsValues,
	StoreSettingsValues
} from '$lib/schemas';

/** The store's current configuration. Static in this mockup. */
export const storeSettings: StoreSettingsValues = {
	storeName: 'YAS Outlet',
	contactEmail: 'hello@yasoutlet.bh',
	whatsapp: '+973 3300 0000',
	currency: 'BHD',
	language: 'en',
	address: 'Shop 24, Seef Mall, Manama, Bahrain'
};

export const deliverySettings: DeliverySettingsValues = {
	deliveryFee: 2,
	freeDeliveryThreshold: 50,
	cutoffTime: '12:00',
	areas: 'Manama, Riffa, Muharraq, Isa Town',
	sameDayDelivery: true
};

export const paymentSettings: PaymentSettingsValues = {
	methods: [
		{ name: 'Cash on Delivery', enabled: true },
		{ name: 'BenefitPay', enabled: true },
		{ name: 'Card Payment', enabled: true },
		{ name: 'Bank Transfer', enabled: false }
	]
};

export const orderSettings: OrderSettingsValues = {
	defaultStatus: 'new',
	preorderDepositPercent: 50,
	tourDeposit: 40,
	cancellationPolicy: 'Orders can be cancelled within 24 hours of placement for a full refund.',
	returnPolicy: 'Returns accepted within 7 days for unused items with tags attached.'
};

export const notificationSettings: NotificationSettingsValues = {
	newOrders: true,
	payments: true,
	lowStock: true,
	tourDeadlines: false
};
