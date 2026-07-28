import type { Actions, PageServerLoad } from './$types';
import { customers, findCustomer } from '$lib/data/customers';
import { ordersForCustomer } from '$lib/data/orders';
import { noteSchema } from '$lib/schemas';
import { param } from '$lib/utils';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ url }) => {
	const search = param(url, 'q', '').trim().toLowerCase();

	const filtered = customers.filter((customer) => {
		if (!search) return true;
		return (
			customer.name.toLowerCase().includes(search) ||
			customer.phone.includes(search) ||
			customer.email.toLowerCase().includes(search)
		);
	});

	// A `customer` parameter deep-links straight into the details drawer.
	const selectedId = param(url, 'customer', '');
	const selected = selectedId ? findCustomer(selectedId) : undefined;

	return {
		search: param(url, 'q', ''),
		total: customers.length,
		customers: filtered,
		selected: selected ?? null,
		history: selected ? ordersForCustomer(selected.id) : [],
		noteForm: await superValidate({ note: selected?.notes ?? '' }, zod4(noteSchema))
	};
};

export const actions: Actions = {
	/** Mock-only: validates the internal note and confirms it was saved. */
	saveNote: async ({ request }) => {
		const form = await superValidate(request, zod4(noteSchema));
		if (!form.valid) return { form };

		return message(form, 'Note saved');
	}
};
