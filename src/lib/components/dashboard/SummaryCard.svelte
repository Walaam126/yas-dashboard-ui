<script lang="ts">
	import type { LucideIcon } from '@lucide/svelte';
	import { cn } from '$lib/utils';
	import TrendingDownIcon from '@lucide/svelte/icons/trending-down';
	import TrendingUpIcon from '@lucide/svelte/icons/trending-up';

	type Tone = 'gold' | 'amber' | 'red' | 'green';

	type Props = {
		label: string;
		value: string;
		icon: LucideIcon;
		context?: string;
		trend?: 'up' | 'down';
		tone?: Tone;
	};

	let { label, value, icon: Icon, context, trend, tone = 'gold' }: Props = $props();

	const iconTone: Record<Tone, string> = {
		gold: 'bg-gold-soft text-gold-dark',
		amber: 'bg-warning-soft text-warning',
		red: 'bg-danger-soft text-danger',
		green: 'bg-success-soft text-success'
	};
</script>

<div class="rounded-xl border border-beige-border bg-surface p-4 shadow-card sm:p-5">
	<div class="flex items-start justify-between gap-3">
		<p class="text-sm font-medium text-espresso-muted">{label}</p>
		<span
			class={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', iconTone[tone])}
		>
			<Icon class="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
		</span>
	</div>
	<p class="mt-3 font-serif text-2xl font-semibold text-espresso sm:text-[28px]">{value}</p>
	{#if context}
		<p class="mt-1.5 flex items-center gap-1 text-xs text-espresso-muted">
			{#if trend === 'up'}
				<TrendingUpIcon class="h-3.5 w-3.5 text-success" aria-hidden="true" />
			{:else if trend === 'down'}
				<TrendingDownIcon class="h-3.5 w-3.5 text-danger" aria-hidden="true" />
			{/if}
			{context}
		</p>
	{/if}
</div>
