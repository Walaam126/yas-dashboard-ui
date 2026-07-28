import { goto } from '$app/navigation';
import { withParams } from './url-state';

/**
 * Push filter/search state into the URL so it stays shareable and survives a
 * refresh. Replaces history and keeps focus so typing in a search field is not
 * interrupted.
 *
 * The target is derived from the page's own already-resolved URL, so
 * `resolve()` has nothing to add here.
 */
export const applyParams = (url: URL, updates: Record<string, string | null>) =>
	goto(withParams(url, updates), {
		replaceState: true,
		keepFocus: true,
		noScroll: true
	});
