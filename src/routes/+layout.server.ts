import type { LayoutServerLoad } from './$types';
import { takeFlash } from '$lib/server/flash';

export const load: LayoutServerLoad = ({ cookies }) => {
	return { flash: takeFlash(cookies) };
};
