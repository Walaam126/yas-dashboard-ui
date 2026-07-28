<script lang="ts">
	import { resolve } from '$app/paths';
	import InitialsAvatar from '$lib/components/shared/InitialsAvatar.svelte';
	import SearchField from '$lib/components/shared/SearchField.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { cn } from '$lib/utils';
	import BellIcon from '@lucide/svelte/icons/bell';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import LogOutIcon from '@lucide/svelte/icons/log-out';
	import MenuIcon from '@lucide/svelte/icons/menu';
	import SearchIcon from '@lucide/svelte/icons/search';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import UserIcon from '@lucide/svelte/icons/user';
	import { slide } from 'svelte/transition';
	import { getNotifications } from './notifications';

	type Props = {
		onopenmobilenav: () => void;
	};

	let { onopenmobilenav }: Props = $props();

	const notifications = getNotifications();

	let searchOpen = $state(false);
	let profileOpen = $state(false);
</script>

<header
	class="bg-background/90 sticky top-0 z-40 flex h-16 items-center gap-2 border-b px-4 backdrop-blur-sm sm:px-6"
>
	<Button variant="ghost" size="icon" onclick={onopenmobilenav} class="lg:hidden">
		<MenuIcon class="h-5 w-5" aria-hidden="true" />
		<span class="sr-only">Open menu</span>
	</Button>

	<!-- Global search: submits into the orders list, which is the busiest view. -->
	<div class="relative max-w-md flex-1">
		<form action={resolve('/admin/orders')} class="hidden md:block" role="search">
			<SearchField
				id="global-search"
				label="Search orders, products and customers"
				name="q"
				placeholder="Search orders, products, customers…"
				inputClass="h-9"
			/>
		</form>
		<Button
			variant="ghost"
			size="icon"
			onclick={() => (searchOpen = !searchOpen)}
			aria-expanded={searchOpen}
			aria-controls="mobile-search"
			class="md:hidden"
		>
			<SearchIcon class="h-5 w-5" aria-hidden="true" />
			<span class="sr-only">Search</span>
		</Button>
	</div>

	<div class="ml-auto flex items-center gap-1 sm:gap-2">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button variant="ghost" size="icon" class="relative" {...props}>
						<BellIcon class="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
						<span
							class="bg-primary ring-background absolute top-2 right-2 h-2 w-2 rounded-full ring-2"
							aria-hidden="true"
						></span>
						<span class="sr-only">Notifications ({notifications.length} unread)</span>
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end" class="w-80 p-0">
				<DropdownMenu.Group>
					<DropdownMenu.Label class="text-foreground border-b px-4 py-2.5 text-sm font-semibold">
						Notifications
					</DropdownMenu.Label>
					<div class="max-h-80 overflow-y-auto py-1">
						{#each notifications as notification (notification.title)}
							<DropdownMenu.Item class="flex-col items-start gap-0.5 px-4 py-2.5">
								<span class="text-sm">{notification.title}</span>
								<span class="text-muted-foreground text-xs">{notification.time}</span>
							</DropdownMenu.Item>
						{/each}
					</div>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>

		<DropdownMenu.Root bind:open={profileOpen}>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button variant="ghost" class="h-auto gap-2 py-1 pr-2 pl-1" {...props}>
						<InitialsAvatar name="Layla" />
						<span class="hidden text-left sm:block">
							<span class="block text-sm leading-tight font-medium">Layla</span>
							<span class="text-muted-foreground block text-xs leading-tight">Store Owner</span>
						</span>
						<ChevronDownIcon
							class={cn(
								'text-muted-foreground hidden h-4 w-4 transition-transform sm:block',
								profileOpen && 'rotate-180'
							)}
							aria-hidden="true"
						/>
						<span class="sr-only">Admin profile menu</span>
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end" class="w-52">
				<DropdownMenu.Group>
					<DropdownMenu.Label class="text-foreground border-b px-4 py-2.5 text-sm font-medium">
						<span class="block">Layla Ahmed</span>
						<span class="text-muted-foreground block text-xs font-normal">layla@yasoutlet.bh</span>
					</DropdownMenu.Label>
					<DropdownMenu.Item>
						<UserIcon class="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
						My Profile
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						{#snippet child({ props })}
							<a href={resolve('/admin/settings')} {...props}>
								<SettingsIcon class="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
								Settings
							</a>
						{/snippet}
					</DropdownMenu.Item>
					<DropdownMenu.Separator />
					<DropdownMenu.Item variant="destructive">
						<LogOutIcon class="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
						Sign Out
					</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>

	{#if searchOpen}
		<div
			id="mobile-search"
			transition:slide={{ duration: 160 }}
			class="bg-background absolute inset-x-0 top-full border-b p-3 md:hidden"
		>
			<form action={resolve('/admin/orders')} role="search">
				<!-- The overlay exists only to expose this field, so focusing it is expected. -->
				<SearchField
					id="mobile-search-input"
					label="Search"
					name="q"
					placeholder="Search…"
					autofocus
				/>
			</form>
		</div>
	{/if}
</header>
