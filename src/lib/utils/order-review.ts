import type { NewOrderValues } from '$lib/schemas/order';
import type { Customer } from '$lib/types';
import { formatAddress, formatBahrainPhone } from './address';
import { orderTypeMap } from './labels';
import { orderTotals } from './order-totals';

export interface ChosenCustomer {
	id: string;
	name: string;
	phone: string;
	email: string;
	address: string;
}

/**
 * The customer this order is for, whether picked from the directory or typed in
 * on the spot. A half-finished new customer counts as nobody, so the summary
 * keeps saying `Not selected` until the details are usable.
 */
export function chosenCustomer(
	values: NewOrderValues,
	directory: Customer[]
): ChosenCustomer | null {
	if (values.customerSource === 'existing') {
		const match = directory.find((customer) => customer.id === values.customerId);
		if (!match) return null;
		return {
			id: match.id,
			name: match.name,
			phone: match.phone,
			email: match.email,
			address: match.addresses[0] ?? ''
		};
	}

	const details = values.newCustomer;
	const complete =
		details.name.trim().length >= 2 &&
		/^\d{8}$/.test(details.phone.replace(/\s/g, '')) &&
		Boolean(
			details.area.trim() && details.block.trim() && details.road.trim() && details.building.trim()
		);
	if (!complete) return null;

	return {
		id: '',
		name: details.name.trim(),
		phone: formatBahrainPhone(details.phone),
		email: details.email.trim(),
		address: formatAddress({
			building: details.building,
			road: details.road,
			block: details.block,
			area: details.area,
			extra: details.extra
		})
	};
}

/**
 * The one thing still missing before the order can be created, phrased as the
 * next thing to do. Returning a single sentence — rather than a list of every
 * gap — keeps the guidance under the Create Order button short enough to read
 * at a glance, and it updates itself as each step is completed.
 */
export function nextStepMessage(values: NewOrderValues): string | null {
	const customer = values.newCustomer;

	if (values.customerSource === 'existing' && !values.customerId) {
		return 'Choose a customer to continue.';
	}
	if (
		values.customerSource === 'new' &&
		(customer.name.trim().length < 2 ||
			!/^\d{8}$/.test(customer.phone.replace(/\s/g, '')) ||
			!customer.area.trim() ||
			!customer.block.trim() ||
			!customer.road.trim() ||
			!customer.building.trim())
	) {
		return 'Fill in the new customer details to continue.';
	}

	if (values.items.length === 0) {
		return 'Add at least one product to continue.';
	}
	if (values.items.some((line) => line.orderType !== values.orderType)) {
		return `Remove the products that are not available as ${orderTypeMap[values.orderType].label}.`;
	}
	if (values.orderType === 'tour' && !values.tourId) {
		return 'Choose the tour for this order to continue.';
	}

	if (values.deliveryMethod !== 'pickup') {
		if (values.useDifferentAddress && values.differentAddress.trim().length < 8) {
			return 'Enter the delivery address to continue.';
		}
		if (!values.deliveryDate) {
			return 'Choose the delivery date to continue.';
		}
	}

	const totals = orderTotals(values);

	// A cleared number input is empty, not zero, so each amount is checked for a
	// usable number rather than compared straight away.
	if (values.deliveryMethod !== 'pickup' && !Number.isFinite(values.deliveryFee)) {
		return 'Enter the delivery fee, or 0 if there is none.';
	}
	if (values.discountKind !== 'none' && !(values.discountValue > 0)) {
		return 'Enter the discount amount, or choose No discount.';
	}
	if (values.discountKind === 'percentage' && values.discountValue > 100) {
		return 'A percentage discount cannot be more than 100%.';
	}
	if (values.discountKind === 'fixed' && values.discountValue > totals.subtotal) {
		return 'The discount cannot be higher than the subtotal.';
	}
	if (!Number.isFinite(values.adjustment)) {
		return 'Enter the adjustment amount, or 0 for none.';
	}
	if (values.adjustment !== 0 && !values.adjustmentReason.trim()) {
		return 'Add a short reason for the price adjustment.';
	}

	if (!values.paymentMethod) {
		return 'Choose a payment method to create the order.';
	}
	if (values.paymentStatus === 'partial') {
		if (!(values.amountPaid > 0)) return 'Enter the amount the customer has paid.';
		if (values.amountPaid >= totals.total) {
			return 'The amount paid must be less than the order total.';
		}
	}

	return null;
}
