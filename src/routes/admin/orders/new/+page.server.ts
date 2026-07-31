import type { Actions, PageServerLoad } from './$types';
import { customers } from '$lib/data/customers';
import { products } from '$lib/data/products';
import { tours } from '$lib/data/tours';
import { newOrderSchema } from '$lib/schemas';
import { setFlash } from '$lib/server/flash';
import { createOrderFromForm, emptyOrderForm } from '$lib/server/order-form';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async () => {
	return {
		// `errors: false` keeps a blank order sheet free of red text on first load.
		form: await superValidate(emptyOrderForm(), zod4(newOrderSchema), { errors: false }),
		customers,
		products,
		tours
	};
};

export const actions: Actions = {
	/**
	 * Mock-only: the validated order joins the in-memory catalogue, so the
	 * administrator lands on a details page showing exactly what was entered.
	 */
	default: async (event) => {
		const form = await superValidate(event.request, zod4(newOrderSchema));
		if (!form.valid) return { form };

		const order = createOrderFromForm(form.data);

		setFlash(event.cookies, `Order ${order.number} was created successfully.`);
		redirect(303, `/admin/orders/${order.id}`);
	}
};
