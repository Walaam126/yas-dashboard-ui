import type { Actions, PageServerLoad } from './$types';
import { discounts, findDiscount } from '$lib/data/discounts';
import { discountSchema } from '$lib/schemas';
import { discountToForm, emptyDiscountForm } from '$lib/server/discount-form';
import { param } from '$lib/utils';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ url }) => {
	// `edit=<id>` opens the drawer pre-filled; no parameter means "create new".
	const editId = param(url, 'edit', '');
	const editing = editId ? findDiscount(editId) : undefined;

	return {
		discounts,
		editing: editing ?? null,
		form: await superValidate(
			editing ? discountToForm(editing) : emptyDiscountForm(),
			zod4(discountSchema)
		)
	};
};

export const actions: Actions = {
	/** Mock-only: validates the discount and confirms, without persisting it. */
	save: async ({ request }) => {
		const form = await superValidate(request, zod4(discountSchema));
		if (!form.valid) return { form };

		return message(form, `${form.data.name} saved`);
	}
};
