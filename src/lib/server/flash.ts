import type { Cookies } from '@sveltejs/kit';

const FLASH_COOKIE = 'yas_flash';

/**
 * Carries a one-shot confirmation across a POST-redirect-GET so the toast still
 * appears on the page the user lands on.
 */
export function setFlash(cookies: Cookies, message: string): void {
	cookies.set(FLASH_COOKIE, message, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 60
	});
}

/** Read and clear the pending message. */
export function takeFlash(cookies: Cookies): string | null {
	const message = cookies.get(FLASH_COOKIE);
	if (message === undefined) return null;
	cookies.delete(FLASH_COOKIE, { path: '/' });
	return message;
}
