import { z } from 'zod';

export const CATEGORY_VALUES = ['Women', 'Men', 'Kids'] as const;
export const PRODUCT_TYPE_VALUES = ['Bag', 'Shoes', 'Clothes', 'Accessories'] as const;
export const ORDER_TYPE_VALUES = ['ready', 'preorder', 'tour'] as const;
export const VISIBILITY_VALUES = ['published', 'draft', 'hidden'] as const;
export const DELIVERY_AVAILABILITY_VALUES = ['same_day', 'standard'] as const;

const optionalDate = z.union([z.iso.date(), z.literal('')]).default('');
const price = z.number().min(0, 'Price cannot be negative').max(1_000_000, 'Price looks too large');

export const productSchema = z
	.object({
		name: z.string().trim().min(2, 'Product name is required'),
		brand: z.string().trim().min(1, 'Brand is required'),
		category: z.enum(CATEGORY_VALUES),
		productType: z.enum(PRODUCT_TYPE_VALUES),
		orderType: z.enum(ORDER_TYPE_VALUES),
		description: z
			.string()
			.trim()
			.max(2000, 'Keep the description under 2000 characters')
			.default(''),

		price,
		salePrice: z.union([price, z.literal('')]).optional(),
		costPrice: z.union([price, z.literal('')]).optional(),

		colors: z.string().trim().default(''),
		sizes: z.string().trim().default(''),
		sku: z
			.string()
			.trim()
			.min(3, 'SKU is required')
			.max(32, 'SKU is too long')
			.regex(/^[\w-]+$/, 'Use letters, numbers, hyphens and underscores only'),
		trackInventory: z.boolean().default(true),
		stock: z
			.number()
			.int('Stock must be a whole number')
			.min(0, 'Stock cannot be negative')
			.default(0),
		lowStockThreshold: z.number().int().min(0, 'Threshold cannot be negative').default(3),

		// Ready to Ship
		deliveryAvailability: z.enum(DELIVERY_AVAILABILITY_VALUES).default('same_day'),

		// Pre-order
		expectedArrival: optionalDate,
		orderDeadline: optionalDate,
		depositAmount: z.union([price, z.literal('')]).optional(),
		preorderNotice: z.string().trim().max(500).default(''),

		// Tour
		tourId: z.string().trim().default(''),

		visibility: z.enum(VISIBILITY_VALUES),
		featured: z.boolean().default(false)
	})
	.superRefine((value, ctx) => {
		if (typeof value.salePrice === 'number' && value.salePrice >= value.price) {
			ctx.addIssue({
				code: 'custom',
				path: ['salePrice'],
				message: 'Sale price must be lower than the regular price'
			});
		}

		if (value.orderType === 'ready' && value.trackInventory && value.stock <= 0) {
			ctx.addIssue({
				code: 'custom',
				path: ['stock'],
				message: 'Ready to Ship products need stock on hand'
			});
		}

		if (value.orderType === 'preorder') {
			if (!value.expectedArrival) {
				ctx.addIssue({
					code: 'custom',
					path: ['expectedArrival'],
					message: 'Pre-orders need an expected arrival date'
				});
			}
			if (!value.orderDeadline) {
				ctx.addIssue({
					code: 'custom',
					path: ['orderDeadline'],
					message: 'Pre-orders need an order deadline'
				});
			}
			if (
				value.expectedArrival &&
				value.orderDeadline &&
				value.orderDeadline > value.expectedArrival
			) {
				ctx.addIssue({
					code: 'custom',
					path: ['orderDeadline'],
					message: 'The deadline must fall before the expected arrival'
				});
			}
		}

		if (value.orderType === 'tour') {
			if (!value.tourId) {
				ctx.addIssue({
					code: 'custom',
					path: ['tourId'],
					message: 'Choose the tour this product belongs to'
				});
			}
			if (typeof value.depositAmount !== 'number' || value.depositAmount <= 0) {
				ctx.addIssue({
					code: 'custom',
					path: ['depositAmount'],
					message: 'Tour products need a required deposit'
				});
			}
		}
	});

export type ProductFormValues = z.infer<typeof productSchema>;
