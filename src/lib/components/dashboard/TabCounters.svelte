<script lang="ts" module>
	export interface TabCounter {
		key: string;
		label: string;
		count: number;
		href: string;
	}
</script>

<script lang="ts">
	import { cn } from '$lib/utils';

	type Props = {
		tabs: TabCounter[];
		active: string;
		label: string;
	};

	let { tabs, active, label }: Props = $props();
</script>

<!--
	Tab hrefs are produced by `withParams()` from the page's own (already resolved)
	URL, so `resolve()` has nothing left to contribute here.
-->
<!-- eslint-disable svelte/no-navigation-without-resolve -->
<nav class="flex flex-wrap gap-1.5" aria-label={label}>
	{#each tabs as tab (tab.key)}
		{@const isActive = tab.key === active}
		<a
			href={tab.href}
			aria-current={isActive ? 'page' : undefined}
			data-sveltekit-replacestate
			data-sveltekit-noscroll
			class={cn(
				'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
				isActive
					? 'bg-foreground text-background'
					: 'border border-border bg-card text-espresso-light hover:bg-accent'
			)}
		>
			{tab.label}
			<span
				class={cn(
					'rounded-full px-1.5 text-xs',
					isActive ? 'bg-background/20 text-background' : 'bg-muted text-muted-foreground'
				)}
			>
				{tab.count}
			</span>
		</a>
	{/each}
</nav>
