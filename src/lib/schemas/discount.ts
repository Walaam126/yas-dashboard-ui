import { z } from 'zod';

export const DISCOUNT_TYPE_VALUES = [
	'percentage',
	'fixed',
	'product',
	'category',
	'promo'
] as const;
export const DISCOUNT_SCOPE_VALUES = ['all', 'Women', 'Men', 'Kids'] as const;

export const discountSchema = z
	.object({
		name: z.string().trim().min(2, 'Discount name is required'),
		code: z
			.string()
			.trim()
			.min(3, 'Promo code is required')
			.max(24, 'Promo code is too long')
			.regex(/^[A-Z0-9]+$/, 'Use capital letters and numbers only')
			.transform((code) => code.toUpperCase()),
		type: z.enum(DISCOUNT_TYPE_VALUES),
		value: z.number().positive('Enter a value greater than zero'),
		/** Restricts a product- or category-scoped discount. */
		scope: z.enum(DISCOUNT_SCOPE_VALUES).default('all'),
		minimumOrder: z.number().min(0, 'Minimum order cannot be negative').default(0),
		usageLimit: z
			.number()
			.int('Usage limit must be a whole number')
			.min(1, 'Allow at least one use')
			.max(100_000, 'That limit looks too large'),
		start: z.iso.date('Choose a valid start date'),
		end: z.iso.date('Choose a valid end date'),
		active: z.boolean().default(true)
	})
	.superRefine((value, ctx) => {
		if (value.end <= value.start) {
			ctx.addIssue({
				code: 'custom',
				path: ['end'],
				message: 'The end date must come after the start date'
			});
		}

		if (value.type === 'percentage' && value.value > 100) {
			ctx.addIssue({
				code: 'custom',
				path: ['value'],
				message: 'A percentage discount cannot exceed 100'
			});
		}
	});

export type DiscountFormValues = z.infer<typeof discountSchema>;
