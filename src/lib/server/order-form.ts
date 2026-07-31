import type { NewOrderValues } from '$lib/schemas';
import type { Customer, Order, OrderItem } from '$lib/types';
import { addCustomer, findCustomer, nextCustomerId } from '$lib/data/customers';
import { addOrder, nextOrderNumber } from '$lib/data/orders';
import { findTour } from '$lib/data/tours';
import {
	DEFAULT_DELIVERY_FEE,
	formatAddress,
	formatBahrainPhone,
	orderTotals,
	paymentMethodMap
} from '$lib/utils';

/** Today, in the `2026-07-31` shape an `<input type="date">` expects. */
function today(): string {
	return new Date().toISOString().slice(0, 10);
}

/**
 * A blank order sheet. Every default here is one fewer decision for the
 * administrator: same-day delivery of ready stock, one of each product, unpaid,
 * no discount and the store's normal delivery fee.
 */
export function emptyOrderForm(): NewOrderValues {
	return {
		customerSource: 'existing',
		customerId: '',
		newCustomer: {
			name: '',
			phone: '',
			email: '',
			area: '',
			block: '',
			road: '',
			building: '',
			extra: ''
		},

		orderType: 'ready',
		tourId: '',
		expectedArrival: '',
		items: [],

		deliveryMethod: 'same_day',
		useDifferentAddress: false,
		differentAddress: '',
		deliveryDate: today(),
		timeSlot: 'any',
		deliveryInstructions: '',

		paymentStatus: 'unpaid',
		paymentMethod: '',
		amountPaid: 0,

		discountKind: 'none',
		discountValue: 0,
		deliveryFee: DEFAULT_DELIVERY_FEE,
		adjustment: 0,
		adjustmentReason: '',

		customerNote: '',
		teamNote: ''
	};
}

function newCustomerRecord(values: NewOrderValues): Customer {
	const details = values.newCustomer;
	return {
		id: nextCustomerId(),
		name: details.name,
		phone: formatBahrainPhone(details.phone),
		email: details.email,
		orders: 0,
		spent: 0,
		lastOrder: today(),
		status: 'new',
		addresses: [
			formatAddress({
				building: details.building,
				road: details.road,
				block: details.block,
				area: details.area,
				extra: details.extra
			})
		]
	};
}

/**
 * Turn a completed order sheet into a catalogue record. Mock-only: the customer
 * (when new) and the order join the in-memory data so the order details page can
 * show exactly what was entered.
 */
export function createOrderFromForm(values: NewOrderValues): Order {
	const customer =
		values.customerSource === 'new'
			? addCustomer(newCustomerRecord(values))
			: findCustomer(values.customerId);

	const savedAddress = customer?.addresses[0] ?? '';
	const address =
		values.deliveryMethod === 'pickup'
			? savedAddress
			: values.useDifferentAddress
				? values.differentAddress
				: savedAddress;

	const totals = orderTotals(values);
	const items: OrderItem[] = values.items.map((line, index) => ({
		id: `i-${index + 1}`,
		name: line.name,
		brand: line.brand,
		image: line.image,
		size: line.size,
		color: line.color,
		qty: line.qty,
		price: line.price
	}));

	const number = nextOrderNumber();
	const tour = values.orderType === 'tour' ? findTour(values.tourId) : undefined;
	const stamp = new Date().toLocaleString('en-GB', {
		day: 'numeric',
		month: 'short',
		hour: '2-digit',
		minute: '2-digit'
	});

	return addOrder({
		id: number.replace('#', ''),
		number,
		customer: customer?.name ?? 'Walk-in customer',
		customerId: customer?.id ?? '',
		phone: customer?.phone ?? '',
		email: customer?.email ?? '',
		type: values.orderType,
		status: 'new',
		payment: values.paymentStatus,
		paymentMethod: values.paymentMethod ? paymentMethodMap[values.paymentMethod] : '—',
		delivery: values.deliveryMethod,
		address,
		items,
		subtotal: totals.subtotal,
		discount: totals.discount,
		deliveryFee: totals.deliveryFee,
		adjustment: totals.adjustment === 0 ? undefined : totals.adjustment,
		adjustmentReason: values.adjustmentReason || undefined,
		total: totals.total,
		date: today(),
		customerNote: values.customerNote || undefined,
		adminNote: values.teamNote || undefined,
		expectedDate: values.expectedArrival || undefined,
		tourName: tour?.name,
		deposit: values.paymentStatus === 'partial' ? values.amountPaid : undefined,
		remaining:
			values.paymentStatus === 'partial'
				? Math.round((totals.total - values.amountPaid) * 1000) / 1000
				: undefined,
		activity: [{ label: 'Order created', date: stamp, by: 'Admin' }]
	});
}
