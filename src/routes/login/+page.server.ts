import type { Actions, PageServerLoad } from './$types';
import { loginSchema } from '$lib/schemas';
import { setFlash } from '$lib/server/flash';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async () => {
	// `errors: false` keeps the empty form clean on first paint.
	return { form: await superValidate(zod4(loginSchema), { errors: false }) };
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(loginSchema));
		// Returning the form preserves what was typed so nothing has to be re-entered.
		if (!form.valid) return fail(400, { form });

		// Mock-only: there is no auth API yet, so any valid credentials sign in.
		setFlash(cookies, 'Signed in to YAS Outlet Admin');
		redirect(303, '/admin');
	}
};
