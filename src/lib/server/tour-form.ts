import type { TourFormValues } from '$lib/schemas';
import type { Tour } from '$lib/types';
import { toDateInputValue } from '$lib/utils';

/** Sensible defaults for the create-tour drawer. */
export function emptyTourForm(today = new Date()): TourFormValues {
	const inDays = (days: number) => {
		const date = new Date(today);
		date.setDate(date.getDate() + days);
		return toDateInputValue(date.toISOString());
	};

	return {
		name: '',
		destination: '',
		description: '',
		openingDate: inDays(1),
		orderDeadline: inDays(21),
		travelDate: inDays(28),
		arrivalDate: inDays(32),
		deposit: 40,
		instructions: '',
		status: 'draft',
		published: true
	};
}

export function tourToForm(tour: Tour): TourFormValues {
	return {
		name: tour.name,
		destination: tour.destination,
		description: tour.description,
		openingDate: toDateInputValue(tour.openingDate),
		orderDeadline: toDateInputValue(tour.orderDeadline),
		travelDate: toDateInputValue(tour.travelDate),
		arrivalDate: toDateInputValue(tour.arrivalDate),
		deposit: tour.deposit,
		instructions: '',
		status: tour.status,
		published: tour.status !== 'draft'
	};
}
