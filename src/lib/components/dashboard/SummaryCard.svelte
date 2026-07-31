<script lang="ts">
	import type { LucideIcon } from '@lucide/svelte';
	import { Card, CardContent } from '$lib/components/ui/card';
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

<Card>
	<CardContent class="p-4 sm:p-5">
		<div class="flex items-start justify-between gap-3">
			<p class="text-muted-foreground text-sm font-medium">{label}</p>
			<span
				class={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', iconTone[tone])}
			>
				<Icon class="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
			</span>
		</div>
		<p class="mt-3 font-serif text-2xl font-semibold sm:text-[28px]">{value}</p>
		{#if context}
			<p class="text-muted-foreground mt-1.5 flex items-center gap-1 text-xs">
				{#if trend === 'up'}
					<TrendingUpIcon class="text-success h-3.5 w-3.5" aria-hidden="true" />
				{:else if trend === 'down'}
					<TrendingDownIcon class="text-danger h-3.5 w-3.5" aria-hidden="true" />
				{/if}
				{context}
			</p>
		{/if}
	</CardContent>
</Card>
