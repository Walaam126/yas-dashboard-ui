import type { TourFormValues } from '$lib/schemas';
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
