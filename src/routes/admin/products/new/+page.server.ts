import type { Actions, PageServerLoad } from './$types';
import { IMAGES } from '$lib/data/images';
import { tours } from '$lib/data/tours';
import { productSchema } from '$lib/schemas';
import { setFlash } from '$lib/server/flash';
import { emptyProductForm } from '$lib/server/product-form';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(emptyProductForm, zod4(productSchema)),
		tours,
		galleryOptions: Object.values(IMAGES)
	};
};

export const actions: Actions = {
	/** Mock-only: validates the submission, then returns to the catalogue. */
	default: async (event) => {
		const form = await superValidate(event.request, zod4(productSchema));
		if (!form.valid) return { form };

		setFlash(event.cookies, `${form.data.name} created`);
		redirect(303, '/admin/products');
	}
};
