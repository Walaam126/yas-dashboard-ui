import type { Actions, PageServerLoad } from './$types';
import { findOrder } from '$lib/data/orders';
import { noteSchema, orderStatusUpdateSchema } from '$lib/schemas';
import { orderStatusMap } from '$lib/utils';
import { error } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ params }) => {
	const order = findOrder(params.id);
	if (!order) {
		error(404, 'This order may have been removed.');
	}

	return {
		order,
		statusForm: await superValidate({ status: order.status }, zod4(orderStatusUpdateSchema)),
		noteForm: await superValidate({ note: order.adminNote ?? '' }, zod4(noteSchema))
	};
};

export const actions: Actions = {
	/**
	 * Mock-only: the catalogue is static, so a successful submission validates the
	 * input and reports back rather than persisting anything.
	 */
	updateStatus: async ({ request }) => {
		const form = await superValidate(request, zod4(orderStatusUpdateSchema));
		if (!form.valid) return { form };

		return message(form, `Status updated to ${orderStatusMap[form.data.status].label}`);
	},

	saveNote: async ({ request }) => {
		const form = await superValidate(request, zod4(noteSchema));
		if (!form.valid) return { form };

		return message(form, 'Note saved');
	}
};
