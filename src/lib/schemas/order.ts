import { orderTypeMap } from '$lib/utils/labels';
import { orderTotals } from '$lib/utils/order-totals';
import { z } from 'zod';
import { ORDER_TYPE_VALUES } from './product';

export const DELIVERY_METHOD_VALUES = ['same_day', 'delivery', 'pickup'] as const;
export const PAYMENT_STATUS_VALUES = ['unpaid', 'paid', 'partial'] as const;
export const PAYMENT_METHOD_VALUES = ['benefitpay', 'cash', 'card', 'transfer', 'link'] as const;
export const DISCOUNT_KIND_VALUES = ['none', 'fixed', 'percentage'] as const;
export const TIME_SLOT_VALUES = ['any', 'morning', 'afternoon', 'evening'] as const;
export const CUSTOMER_SOURCE_VALUES = ['existing', 'new'] as const;

const optionalDate = z.union([z.iso.date(), z.literal('')]).default('');

/**
 * An amount field. Clearing a number input leaves it empty rather than zero, so
 * each one carries its own plain-language message instead of Zod's default
 * "expected number, received undefined".
 */
function money(message: string) {
	return z.number({ error: message });
}

/**
 * One product on the order. The display fields are copied from the catalogue at
 * the moment it is added, so the summary and the created order can be rendered
 * without looking anything up again.
 */
export const orderLineSchema = z.object({
	/** Stable key for the list — the same product can be added in two sizes. */
	key: z.string(),
	productId: z.string(),
	name: z.string(),
	brand: z.string(),
	image: z.string(),
	orderType: z.enum(ORDER_TYPE_VALUES),
	size: z.string().default(''),
	color: z.string().default(''),
	qty: z
		.number()
		.int('Choose a whole number of items')
		.min(1, 'Each product needs at least one item')
		.max(99, 'That quantity looks too large'),
	price: z.number().min(0)
});

const newCustomerSchema = z.object({
	name: z.string().trim().default(''),
	phone: z.string().trim().default(''),
	email: z.string().trim().default(''),
	area: z.string().trim().default(''),
	block: z.string().trim().default(''),
	road: z.string().trim().default(''),
	building: z.string().trim().default(''),
	extra: z.string().trim().default('')
});

export const newOrderSchema = z
	.object({
		// 1. Customer
		customerSource: z.enum(CUSTOMER_SOURCE_VALUES).default('existing'),
		customerId: z.string().default(''),
		newCustomer: newCustomerSchema,

		// 2. Products
		orderType: z.enum(ORDER_TYPE_VALUES).default('ready'),
		tourId: z.string().default(''),
		expectedArrival: optionalDate,
		items: z.array(orderLineSchema).default([]),

		// 3. Delivery
		deliveryMethod: z.enum(DELIVERY_METHOD_VALUES).default('same_day'),
		useDifferentAddress: z.boolean().default(false),
		differentAddress: z.string().trim().default(''),
		deliveryDate: optionalDate,
		timeSlot: z.enum(TIME_SLOT_VALUES).default('any'),
		deliveryInstructions: z.string().trim().max(300, 'Keep the instructions shorter').default(''),

		// 3. Payment
		paymentStatus: z.enum(PAYMENT_STATUS_VALUES).default('unpaid'),
		paymentMethod: z.union([z.enum(PAYMENT_METHOD_VALUES), z.literal('')]).default(''),
		amountPaid: money('Enter the amount the customer has paid.')
			.min(0, 'The amount paid cannot be negative')
			.default(0),

		// Pricing
		discountKind: z.enum(DISCOUNT_KIND_VALUES).default('none'),
		discountValue: money('Enter the discount, or choose No discount.')
			.min(0, 'The discount cannot be negative')
			.default(0),
		deliveryFee: money('Enter the delivery fee, or 0 if there is none.')
			.min(0, 'The delivery fee cannot be negative')
			.default(0),
		adjustment: money('Enter the adjustment amount, or 0 for none.').default(0),
		adjustmentReason: z.string().trim().max(120, 'Keep the reason shorter').default(''),

		// Notes
		customerNote: z.string().trim().max(500, 'Keep the note shorter').default(''),
		teamNote: z.string().trim().max(500, 'Keep the note shorter').default('')
	})
	.superRefine((value, ctx) => {
		const problem = (path: (string | number)[], message: string) =>
			ctx.addIssue({ code: 'custom', path, message });

		// --- Customer -------------------------------------------------------
		if (value.customerSource === 'existing') {
			if (!value.customerId) problem(['customerId'], 'Choose a customer to continue.');
		} else {
			const customer = value.newCustomer;
			if (customer.name.length < 2) {
				problem(['newCustomer', 'name'], "Enter the customer's full name.");
			}
			if (!/^\d{8}$/.test(customer.phone.replace(/\s/g, ''))) {
				problem(['newCustomer', 'phone'], "Enter the customer's 8-digit phone number.");
			}
			if (customer.email && !z.email().safeParse(customer.email).success) {
				problem(['newCustomer', 'email'], 'Enter a valid email address, or leave it empty.');
			}
			if (!customer.area) problem(['newCustomer', 'area'], 'Enter the area, for example Seef.');
			if (!customer.block) problem(['newCustomer', 'block'], 'Enter the block number.');
			if (!customer.road) problem(['newCustomer', 'road'], 'Enter the road number.');
			if (!customer.building) {
				problem(['newCustomer', 'building'], 'Enter the building, villa or flat.');
			}
		}

		// --- Products -------------------------------------------------------
		if (value.items.length === 0) {
			problem(['items'], 'Add at least one product.');
		} else if (value.items.some((line) => line.orderType !== value.orderType)) {
			problem(
				['items'],
				`Some products are not available as ${orderTypeMap[value.orderType].label}. Remove them, or change the order type.`
			);
		}

		if (value.orderType === 'tour' && !value.tourId) {
			problem(['tourId'], 'Choose the tour this order belongs to.');
		}

		// --- Delivery -------------------------------------------------------
		if (value.deliveryMethod !== 'pickup') {
			if (!value.deliveryDate) {
				problem(['deliveryDate'], 'Choose the delivery date.');
			}
			if (value.useDifferentAddress && value.differentAddress.length < 8) {
				problem(['differentAddress'], 'Enter the delivery address.');
			}
		}

		// --- Pricing --------------------------------------------------------
		const totals = orderTotals(value);

		if (value.discountKind === 'percentage' && value.discountValue > 100) {
			problem(['discountValue'], 'A percentage discount cannot be more than 100%.');
		}
		if (value.discountKind === 'fixed' && value.discountValue > totals.subtotal) {
			problem(['discountValue'], 'The discount cannot be higher than the subtotal.');
		}
		if (value.discountKind !== 'none' && value.discountValue <= 0) {
			problem(['discountValue'], 'Enter the discount amount, or choose No discount.');
		}
		if (value.adjustment !== 0 && !value.adjustmentReason) {
			problem(['adjustmentReason'], 'Add a short reason for the price adjustment.');
		}

		// --- Payment --------------------------------------------------------
		if (!value.paymentMethod) {
			problem(['paymentMethod'], 'Choose a payment method to create the order.');
		}
		if (value.paymentStatus === 'partial') {
			if (value.amountPaid <= 0) {
				problem(['amountPaid'], 'Enter the amount the customer has paid.');
			} else if (value.amountPaid >= totals.total) {
				problem(['amountPaid'], 'The amount paid must be less than the order total.');
			}
		}
	});

export type NewOrderValues = z.infer<typeof newOrderSchema>;
export type OrderLineValues = z.infer<typeof orderLineSchema>;
export type NewCustomerValues = z.infer<typeof newCustomerSchema>;
export type DeliveryMethodValue = (typeof DELIVERY_METHOD_VALUES)[number];
export type PaymentStatusValue = (typeof PAYMENT_STATUS_VALUES)[number];
export type PaymentMethodValue = (typeof PAYMENT_METHOD_VALUES)[number];
export type TimeSlotValue = (typeof TIME_SLOT_VALUES)[number];
export type DiscountKindValue = (typeof DISCOUNT_KIND_VALUES)[number];
