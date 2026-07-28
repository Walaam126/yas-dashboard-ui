import type { LucideIcon } from '@lucide/svelte';
import LayoutDashboardIcon from '@lucide/svelte/icons/layout-dashboard';
import PackageIcon from '@lucide/svelte/icons/package';
import PlaneIcon from '@lucide/svelte/icons/plane';
import SettingsIcon from '@lucide/svelte/icons/settings';
import ShoppingBagIcon from '@lucide/svelte/icons/shopping-bag';
import TicketPercentIcon from '@lucide/svelte/icons/ticket-percent';
import UsersIcon from '@lucide/svelte/icons/users';

export interface NavItem {
	label: string;
	href: string;
	icon: LucideIcon;
	/** Only match this exact path — used by the index route. */
	exact?: boolean;
}

export const navItems: NavItem[] = [
	{ label: 'Overview', href: '/admin', icon: LayoutDashboardIcon, exact: true },
	{ label: 'Orders', href: '/admin/orders', icon: ShoppingBagIcon },
	{ label: 'Products', href: '/admin/products', icon: PackageIcon },
	{ label: 'Tours', href: '/admin/tours', icon: PlaneIcon },
	{ label: 'Customers', href: '/admin/customers', icon: UsersIcon },
	{ label: 'Discounts', href: '/admin/discounts', icon: TicketPercentIcon },
	{ label: 'Settings', href: '/admin/settings', icon: SettingsIcon }
];

/** Whether a nav item owns the current pathname. */
export function isNavItemActive(item: NavItem, pathname: string): boolean {
	return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}
