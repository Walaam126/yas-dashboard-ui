import { browser } from '$app/environment';

const STORAGE_KEY = 'yas:sidebar-collapsed';

/**
 * Collapsed state is a durable UI preference rather than page state, so it
 * lives outside the component tree and is mirrored into `localStorage`.
 * The server always renders the expanded sidebar; the preference is applied
 * once the module initialises in the browser.
 */
function createSidebarPreference() {
	let collapsed = $state(browser && localStorage.getItem(STORAGE_KEY) === 'true');

	return {
		get collapsed() {
			return collapsed;
		},
		toggle() {
			collapsed = !collapsed;
			if (browser) localStorage.setItem(STORAGE_KEY, String(collapsed));
		}
	};
}

export const sidebarPreference = createSidebarPreference();
