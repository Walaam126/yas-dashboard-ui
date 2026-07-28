export type TourStatus =
	'draft' | 'open' | 'closed' | 'shopping' | 'returning' | 'completed' | 'cancelled';

export interface Tour {
	id: string;
	name: string;
	destination: string;
	image: string;
	description: string;
	/** Date the tour opens for customer requests. */
	openingDate?: string;
	orderDeadline: string;
	travelDate: string;
	arrivalDate: string;
	requests: number;
	/** Total deposits collected, in BHD. */
	deposits: number;
	/** Deposit required per request, in BHD. */
	deposit: number;
	status: TourStatus;
}
