import { z } from 'zod';

export const TOUR_STATUS_VALUES = [
	'draft',
	'open',
	'closed',
	'shopping',
	'returning',
	'completed',
	'cancelled'
] as const;

export const tourSchema = z
	.object({
		name: z.string().trim().min(2, 'Tour name is required'),
		destination: z.string().trim().min(2, 'Destination is required'),
		description: z
			.string()
			.trim()
			.min(10, 'Add a short description customers will read')
			.max(500, 'Keep the description under 500 characters'),
		openingDate: z.iso.date('Choose a valid opening date'),
		orderDeadline: z.iso.date('Choose a valid order deadline'),
		travelDate: z.iso.date('Choose a valid travel date'),
		arrivalDate: z.iso.date('Choose a valid expected-arrival date'),
		deposit: z
			.number()
			.min(0, 'Deposit cannot be negative')
			.max(10_000, 'That deposit looks too large'),
		instructions: z.string().trim().max(500, 'Keep instructions under 500 characters').default(''),
		status: z.enum(TOUR_STATUS_VALUES),
		published: z.boolean().default(true)
	})
	.superRefine((value, ctx) => {
		const ordered: [keyof typeof value, keyof typeof value, string][] = [
			['openingDate', 'orderDeadline', 'The deadline must come after the opening date'],
			['orderDeadline', 'travelDate', 'Travel must happen after the order deadline'],
			['travelDate', 'arrivalDate', 'Arrival must come after the travel date']
		];

		for (const [earlier, later, message] of ordered) {
			if (String(value[earlier]) >= String(value[later])) {
				ctx.addIssue({ code: 'custom', path: [later], message });
			}
		}
	});

export type TourFormValues = z.infer<typeof tourSchema>;
