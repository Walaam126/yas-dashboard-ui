<script lang="ts">
	import type { NavItem } from './nav-items';
	import { resolve } from '$app/paths';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { cn } from '$lib/utils';
	import { isNavItemActive, navItems } from './nav-items';

	type Props = {
		collapsed?: boolean;
		pathname: string;
		onnavigate?: () => void;
	};

	let { collapsed = false, pathname, onnavigate }: Props = $props();
</script>

{#snippet navLink(item: NavItem, active: boolean, triggerProps: Record<string, unknown> = {})}
	<a
		href={resolve(item.route)}
		aria-current={active ? 'page' : undefined}
		onclick={onnavigate}
		class={cn(
			'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
			collapsed && 'justify-center px-0',
			active
				? 'bg-gold-soft text-gold-dark'
				: 'text-espresso-light hover:bg-accent hover:text-accent-foreground'
		)}
		{...triggerProps}
	>
		{#if active}
			<span
				class="bg-primary absolute top-1/2 left-0 h-6 w-1 -translate-y-1/2 rounded-r-full"
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
{/snippet}

<nav class="flex-1 space-y-1 px-3 py-4" aria-label="Admin navigation">
	<Tooltip.Provider delayDuration={200}>
		{#each navItems as item (item.route)}
			{@const active = isNavItemActive(item, pathname)}
			{#if collapsed}
				<!-- Collapsed rail: the label only exists in the tooltip and the sr-only span. -->
				<Tooltip.Root>
					<Tooltip.Trigger>
						{#snippet child({ props })}
							{@render navLink(item, active, props)}
						{/snippet}
					</Tooltip.Trigger>
					<Tooltip.Content side="right">{item.label}</Tooltip.Content>
				</Tooltip.Root>
			{:else}
				{@render navLink(item, active)}
			{/if}
		{/each}
	</Tooltip.Provider>
</nav>
