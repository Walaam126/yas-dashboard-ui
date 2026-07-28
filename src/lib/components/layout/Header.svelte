<script lang="ts">
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
	class="sticky top-0 z-40 flex h-16 items-center gap-2 border-b border-beige-border bg-cream/90 px-4 backdrop-blur-sm sm:px-6"
>
	<button
		type="button"
		onclick={onopenmobilenav}
		class="flex h-9 w-9 items-center justify-center rounded-lg text-espresso hover:bg-cream-200 lg:hidden"
	>
		<MenuIcon class="h-5 w-5" aria-hidden="true" />
		<span class="sr-only">Open menu</span>
	</button>

	<!-- Global search: submits into the orders list, which is the busiest view. -->
	<div class="relative max-w-md flex-1">
		<form action="/admin/orders" class="hidden items-center md:flex" role="search">
			<label class="sr-only" for="global-search">Search orders, products and customers</label>
			<SearchIcon
				class="pointer-events-none absolute left-3 h-4 w-4 text-espresso-muted"
				aria-hidden="true"
			/>
			<input
				id="global-search"
				name="q"
				type="search"
				placeholder="Search orders, products, customers…"
				class="h-9 w-full rounded-lg border border-beige-border bg-surface pr-3 pl-9 text-sm text-espresso placeholder:text-espresso-muted/60 focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none"
			/>
		</form>
		<button
			type="button"
			onclick={() => (searchOpen = !searchOpen)}
			aria-expanded={searchOpen}
			aria-controls="mobile-search"
			class="flex h-9 w-9 items-center justify-center rounded-lg text-espresso hover:bg-cream-200 md:hidden"
		>
			<SearchIcon class="h-5 w-5" aria-hidden="true" />
			<span class="sr-only">Search</span>
		</button>
	</div>

	<div class="ml-auto flex items-center gap-1 sm:gap-2">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger
				class="relative flex h-9 w-9 items-center justify-center rounded-lg text-espresso hover:bg-cream-200"
			>
				<BellIcon class="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
				<span
					class="absolute top-2 right-2 h-2 w-2 rounded-full bg-gold ring-2 ring-cream"
					aria-hidden="true"
				></span>
				<span class="sr-only">Notifications ({notifications.length} unread)</span>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-80 p-0">
				<DropdownMenu.Group>
					<DropdownMenu.Label>
						<span class="text-sm font-semibold text-espresso">Notifications</span>
					</DropdownMenu.Label>
					<div class="max-h-80 overflow-y-auto py-1">
						{#each notifications as notification (notification.title)}
							<DropdownMenu.Item class="flex-col items-start gap-0.5 px-4 py-2.5">
								<span class="text-sm text-espresso">{notification.title}</span>
								<span class="text-xs text-espresso-muted">{notification.time}</span>
							</DropdownMenu.Item>
						{/each}
					</div>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>

		<DropdownMenu.Root bind:open={profileOpen}>
			<DropdownMenu.Trigger
				class="flex items-center gap-2 rounded-lg py-1 pr-2 pl-1 hover:bg-cream-200"
			>
				<span
					class="flex h-8 w-8 items-center justify-center rounded-full bg-camel font-serif text-sm font-semibold text-espresso"
					aria-hidden="true"
				>
					L
				</span>
				<span class="hidden text-left sm:block">
					<span class="block text-sm leading-tight font-medium text-espresso">Layla</span>
					<span class="block text-xs leading-tight text-espresso-muted">Store Owner</span>
				</span>
				<ChevronDownIcon
					class={cn(
						'hidden h-4 w-4 text-espresso-muted transition-transform sm:block',
						profileOpen && 'rotate-180'
					)}
					aria-hidden="true"
				/>
				<span class="sr-only">Admin profile menu</span>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-52">
				<DropdownMenu.Group>
					<DropdownMenu.Label>
						<span class="block text-sm font-medium text-espresso">Layla Ahmed</span>
						<span class="block text-xs text-espresso-muted">layla@yasoutlet.bh</span>
					</DropdownMenu.Label>
					<DropdownMenu.Item>
						<UserIcon class="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
						My Profile
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						{#snippet child({ props })}
							<a href="/admin/settings" {...props}>
								<SettingsIcon class="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
								Settings
							</a>
						{/snippet}
					</DropdownMenu.Item>
					<DropdownMenu.Separator />
					<DropdownMenu.Item destructive>
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
			class="absolute inset-x-0 top-full border-b border-beige-border bg-cream p-3 md:hidden"
		>
			<form action="/admin/orders" class="relative flex items-center" role="search">
				<label class="sr-only" for="mobile-search-input">Search</label>
				<SearchIcon
					class="pointer-events-none absolute left-3 h-4 w-4 text-espresso-muted"
					aria-hidden="true"
				/>
				<!-- svelte-ignore a11y_autofocus — the field is the sole purpose of this overlay -->
				<input
					id="mobile-search-input"
					name="q"
					type="search"
					autofocus
					placeholder="Search…"
					class="h-10 w-full rounded-lg border border-beige-border bg-surface pr-3 pl-9 text-sm text-espresso focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none"
				/>
			</form>
		</div>
	{/if}
</header>
