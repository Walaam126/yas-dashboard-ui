import type { Actions, PageServerLoad } from './$types';
import { forgotPasswordSchema } from '$lib/schemas';
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async () => {
	// `errors: false` keeps the empty form clean on first paint.
	return { form: await superValidate(zod4(forgotPasswordSchema), { errors: false }) };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod4(forgotPasswordSchema));
		// Returning the form preserves what was typed so nothing has to be re-entered.
		if (!form.valid) return fail(400, { form });

		/*
		 * Mock-only: there is no mail service yet. The address comes back as the
		 * form message, which is what flips the page to its sent state — staying on
		 * the route rather than redirecting is what lets that state name the
		 * address the link went to.
		 */
		return message(form, form.data.email);
	}
};
