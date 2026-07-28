import type { Actions, PageServerLoad } from './$types';
import { ordersForTour } from '$lib/data/orders';
import { findTour } from '$lib/data/tours';
import { tourStatusUpdateSchema } from '$lib/schemas';
import { tourStatusMap } from '$lib/utils';
import { error } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ params }) => {
	const tour = findTour(params.id);
	if (!tour) {
		error(404, 'This tour may have been removed.');
	}

	return {
		tour,
		requests: ordersForTour(tour.name),
		statusForm: await superValidate({ status: tour.status }, zod4(tourStatusUpdateSchema))
	};
};

export const actions: Actions = {
	/** Mock-only: validates the new status and reports it back. */
	updateStatus: async ({ request }) => {
		const form = await superValidate(request, zod4(tourStatusUpdateSchema));
		if (!form.valid) return { form };

		return message(form, `Tour status updated to ${tourStatusMap[form.data.status].label}`);
	}
};
