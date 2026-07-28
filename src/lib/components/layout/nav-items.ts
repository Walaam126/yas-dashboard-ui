import type { LucideIcon } from '@lucide/svelte';
import LayoutDashboardIcon from '@lucide/svelte/icons/layout-dashboard';
import PackageIcon from '@lucide/svelte/icons/package';
import PlaneIcon from '@lucide/svelte/icons/plane';
import SettingsIcon from '@lucide/svelte/icons/settings';
import ShoppingBagIcon from '@lucide/svelte/icons/shopping-bag';
import TicketPercentIcon from '@lucide/svelte/icons/ticket-percent';
import UsersIcon from '@lucide/svelte/icons/users';

/** Parameter-free admin routes reachable from the sidebar. */
export type NavRoute =
	| '/admin'
	| '/admin/orders'
	| '/admin/products'
	| '/admin/tours'
	| '/admin/customers'
	| '/admin/discounts'
	| '/admin/settings';

export interface NavItem {
	label: string;
	route: NavRoute;
	icon: LucideIcon;
	/** Only match this exact path — used by the index route. */
	exact?: boolean;
}

export const navItems: NavItem[] = [
	{ label: 'Overview', route: '/admin', icon: LayoutDashboardIcon, exact: true },
	{ label: 'Orders', route: '/admin/orders', icon: ShoppingBagIcon },
	{ label: 'Products', route: '/admin/products', icon: PackageIcon },
	{ label: 'Tours', route: '/admin/tours', icon: PlaneIcon },
	{ label: 'Customers', route: '/admin/customers', icon: UsersIcon },
	{ label: 'Discounts', route: '/admin/discounts', icon: TicketPercentIcon },
	{ label: 'Settings', route: '/admin/settings', icon: SettingsIcon }
];

/** Whether a nav item owns the current pathname. */
export function isNavItemActive(item: NavItem, pathname: string): boolean {
	return item.exact ? pathname === item.route : pathname.startsWith(item.route);
}
