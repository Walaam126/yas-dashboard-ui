import { z } from 'zod';

export const storeSettingsSchema = z.object({
	storeName: z.string().trim().min(2, 'Store name is required'),
	contactEmail: z.email('Enter a valid email address'),
	whatsapp: z
		.string()
		.trim()
		.regex(/^\+?[\d\s-]{8,20}$/, 'Enter a valid phone number'),
	currency: z.enum(['BHD', 'USD']),
	language: z.enum(['en', 'ar']),
	address: z.string().trim().min(5, 'Store address is required').max(300)
});

export const deliverySettingsSchema = z
	.object({
		deliveryFee: z.number().min(0, 'Delivery fee cannot be negative'),
		freeDeliveryThreshold: z.number().min(0, 'Threshold cannot be negative'),
		cutoffTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use a 24-hour time such as 12:00'),
		areas: z.string().trim().min(2, 'List at least one delivery area'),
		sameDayDelivery: z.boolean().default(true)
	})
	.superRefine((value, ctx) => {
		if (value.freeDeliveryThreshold > 0 && value.freeDeliveryThreshold < value.deliveryFee) {
			ctx.addIssue({
				code: 'custom',
				path: ['freeDeliveryThreshold'],
				message: 'The free-delivery threshold should be higher than the delivery fee'
			});
		}
	});

export const paymentMethodSchema = z.object({
	name: z.string(),
	enabled: z.boolean()
});

export const paymentSettingsSchema = z.object({
	methods: z.array(paymentMethodSchema)
});

export const orderSettingsSchema = z.object({
	defaultStatus: z.enum(['new', 'confirmed']),
	preorderDepositPercent: z
		.number()
		.int('Use a whole percentage')
		.min(0, 'Cannot be negative')
		.max(100, 'Cannot exceed 100%'),
	tourDeposit: z.number().min(0, 'Deposit cannot be negative'),
	cancellationPolicy: z.string().trim().min(10, 'Describe your cancellation policy').max(1000),
	returnPolicy: z.string().trim().min(10, 'Describe your return policy').max(1000)
});

export const notificationSettingsSchema = z.object({
	newOrders: z.boolean().default(true),
	payments: z.boolean().default(true),
	lowStock: z.boolean().default(true),
	tourDeadlines: z.boolean().default(false)
});

export type StoreSettingsValues = z.infer<typeof storeSettingsSchema>;
export type DeliverySettingsValues = z.infer<typeof deliverySettingsSchema>;
export type PaymentSettingsValues = z.infer<typeof paymentSettingsSchema>;
export type OrderSettingsValues = z.infer<typeof orderSettingsSchema>;
export type NotificationSettingsValues = z.infer<typeof notificationSettingsSchema>;
