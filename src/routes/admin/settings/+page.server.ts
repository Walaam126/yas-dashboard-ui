import type { Actions, PageServerLoad } from './$types';
import {
	deliverySettingsSchema,
	notificationSettingsSchema,
	orderSettingsSchema,
	paymentSettingsSchema,
	storeSettingsSchema
} from '$lib/schemas';
import {
	deliverySettings,
	notificationSettings,
	orderSettings,
	paymentSettings,
	storeSettings
} from '$lib/server/settings-defaults';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async () => {
	const [store, delivery, payments, orders, notifications] = await Promise.all([
		superValidate(storeSettings, zod4(storeSettingsSchema)),
		superValidate(deliverySettings, zod4(deliverySettingsSchema)),
		superValidate(paymentSettings, zod4(paymentSettingsSchema)),
		superValidate(orderSettings, zod4(orderSettingsSchema)),
		superValidate(notificationSettings, zod4(notificationSettingsSchema))
	]);

	return { store, delivery, payments, orders, notifications };
};

/** Every action is mock-only: it validates the section and confirms the save. */
export const actions: Actions = {
	store: async ({ request }) => {
		const form = await superValidate(request, zod4(storeSettingsSchema));
		if (!form.valid) return { form };
		return message(form, 'Store details saved');
	},
	delivery: async ({ request }) => {
		const form = await superValidate(request, zod4(deliverySettingsSchema));
		if (!form.valid) return { form };
		return message(form, 'Delivery settings saved');
	},
	payments: async ({ request }) => {
		const form = await superValidate(request, zod4(paymentSettingsSchema));
		if (!form.valid) return { form };
		return message(form, 'Payment methods saved');
	},
	orders: async ({ request }) => {
		const form = await superValidate(request, zod4(orderSettingsSchema));
		if (!form.valid) return { form };
		return message(form, 'Order settings saved');
	},
	notifications: async ({ request }) => {
		const form = await superValidate(request, zod4(notificationSettingsSchema));
		if (!form.valid) return { form };
		return message(form, 'Notification settings saved');
	}
};
