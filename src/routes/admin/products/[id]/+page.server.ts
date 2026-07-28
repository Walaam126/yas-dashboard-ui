import type { Actions, PageServerLoad } from './$types';
import { IMAGES } from '$lib/data/images';
import { findProduct } from '$lib/data/products';
import { tours } from '$lib/data/tours';
import { productSchema } from '$lib/schemas';
import { setFlash } from '$lib/server/flash';
import { productToForm } from '$lib/server/product-form';
import { error, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ params }) => {
	const product = findProduct(params.id);
	if (!product) {
		error(404, 'This product may have been removed.');
	}

	return {
		product,
		form: await superValidate(productToForm(product), zod4(productSchema)),
		tours,
		// The mockup shows a small gallery seeded from the product's own image.
		galleryOptions: Object.values(IMAGES)
	};
};

export const actions: Actions = {
	/** Mock-only: validates the submission, then returns to the catalogue. */
	default: async (event) => {
		const form = await superValidate(event.request, zod4(productSchema));
		if (!form.valid) return { form };

		setFlash(event.cookies, `${form.data.name} updated`);
		redirect(303, '/admin/products');
	}
};
