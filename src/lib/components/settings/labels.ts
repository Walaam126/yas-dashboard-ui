import type { NotificationSettingsValues } from '$lib/schemas';

/** Copy shown beside each payment method toggle. */
export const paymentMethodDescriptions: Record<string, string> = {
	'Cash on Delivery': 'Collect payment on delivery',
	BenefitPay: 'Bahrain instant payment',
	'Card Payment': 'Visa / Mastercard',
	'Bank Transfer': 'Manual bank transfer'
};

export const notificationLabels: {
	key: keyof NotificationSettingsValues;
	name: string;
	description: string;
}[] = [
	{
		key: 'newOrders',
		name: 'New-order notifications',
		description: 'Get notified when a new order arrives'
	},
	{
		key: 'payments',
		name: 'Payment notifications',
		description: 'Get notified when a payment is received'
	},
	{
		key: 'lowStock',
		name: 'Low-stock alerts',
		description: 'Alert when a product drops below threshold'
	},
	{
		key: 'tourDeadlines',
		name: 'Tour deadline reminders',
		description: 'Reminders before a tour order deadline'
	}
];
