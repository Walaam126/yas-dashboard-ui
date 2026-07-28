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
					? 'bg-espresso text-cream'
					: 'border border-beige-border bg-surface text-espresso-light hover:bg-cream-200'
			)}
		>
			{tab.label}
			<span
				class={cn(
					'rounded-full px-1.5 text-xs',
					isActive ? 'bg-cream/20 text-cream' : 'bg-beige text-espresso-muted'
				)}
			>
				{tab.count}
			</span>
		</a>
	{/each}
</nav>
