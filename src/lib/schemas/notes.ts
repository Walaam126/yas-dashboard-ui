import { z } from 'zod';

/** Internal note attached to an order or a customer. */
export const noteSchema = z.object({
	note: z.string().trim().max(1000, 'Keep the note under 1000 characters').default('')
});

export const orderStatusUpdateSchema = z.object({
	status: z.enum([
		'new',
		'confirmed',
		'preparing',
		'ready_delivery',
		'out_delivery',
		'completed',
		'cancelled'
	])
});

export const tourStatusUpdateSchema = z.object({
	status: z.enum(['draft', 'open', 'closed', 'shopping', 'returning', 'completed', 'cancelled'])
});

export type NoteValues = z.infer<typeof noteSchema>;
export type OrderStatusUpdateValues = z.infer<typeof orderStatusUpdateSchema>;
export type TourStatusUpdateValues = z.infer<typeof tourStatusUpdateSchema>;
