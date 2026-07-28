import type { LucideIcon } from '@lucide/svelte';
import BellIcon from '@lucide/svelte/icons/bell';
import ClipboardListIcon from '@lucide/svelte/icons/clipboard-list';
import CreditCardIcon from '@lucide/svelte/icons/credit-card';
import StoreIcon from '@lucide/svelte/icons/store';
import TruckIcon from '@lucide/svelte/icons/truck';

export const SETTINGS_SECTIONS = [
	'store',
	'delivery',
	'payments',
	'orders',
	'notifications'
] as const;

export type SettingsSection = (typeof SETTINGS_SECTIONS)[number];

export const settingsSections: { key: SettingsSection; label: string; icon: LucideIcon }[] = [
	{ key: 'store', label: 'Store Details', icon: StoreIcon },
	{ key: 'delivery', label: 'Delivery', icon: TruckIcon },
	{ key: 'payments', label: 'Payments', icon: CreditCardIcon },
	{ key: 'orders', label: 'Order Settings', icon: ClipboardListIcon },
	{ key: 'notifications', label: 'Notifications', icon: BellIcon }
];

export function isSettingsSection(value: string): value is SettingsSection {
	return (SETTINGS_SECTIONS as readonly string[]).includes(value);
}
