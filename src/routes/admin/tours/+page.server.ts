import type { Actions, PageServerLoad } from './$types';
import { tours } from '$lib/data/tours';
import { tourSchema } from '$lib/schemas';
import { emptyTourForm } from '$lib/server/tour-form';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async () => {
	return {
		total: tours.length,

		// Streamed so the page header renders before the cards arrive.
		results: Promise.resolve(tours),

		createForm: await superValidate(
			emptyTourForm(),
			zod4(tourSchema),
			{
				errors: false
			}
		)
	};
};

export const actions: Actions = {
	/** Mock-only: validates the new tour and confirms, without persisting it. */
	createTour: async ({ request }) => {
		const form = await superValidate(request, zod4(tourSchema));
		if (!form.valid) return { form };

		return message(form, `${form.data.name} created`);
	}
};
