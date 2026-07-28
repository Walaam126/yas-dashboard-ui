<script lang="ts">
	import { resolve } from '$app/paths';
	import { cn } from '$lib/utils';
	import { isNavItemActive, navItems } from './nav-items';

	type Props = {
		collapsed?: boolean;
		pathname: string;
		onnavigate?: () => void;
	};

	let { collapsed = false, pathname, onnavigate }: Props = $props();
</script>

<nav class="flex-1 space-y-1 px-3 py-4" aria-label="Admin navigation">
	{#each navItems as item (item.route)}
		{@const active = isNavItemActive(item, pathname)}
		<a
			href={resolve(item.route)}
			aria-current={active ? 'page' : undefined}
			title={collapsed ? item.label : undefined}
			onclick={onnavigate}
			class={cn(
				'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
				collapsed && 'justify-center px-0',
				active
					? 'bg-gold-soft text-gold-dark'
					: 'text-espresso-light hover:bg-cream-200 hover:text-espresso'
			)}
		>
			{#if active}
				<span
					class="absolute top-1/2 left-0 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gold"
					aria-hidden="true"
				></span>
			{/if}
			<item.icon class="h-5 w-5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
			{#if collapsed}
				<span class="sr-only">{item.label}</span>
			{:else}
				<span>{item.label}</span>
			{/if}
		</a>
	{/each}
</nav>
