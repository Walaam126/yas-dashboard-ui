<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { cn } from '$lib/utils';

	type Props = { rows?: number; cols?: number };

	let { rows = 6, cols = 5 }: Props = $props();
</script>

<div class="divide-y divide-beige-border" role="status" aria-label="Loading results">
	{#each { length: rows } as _, row (row)}
		<div class="flex items-center gap-4 px-4 py-4">
			{#each { length: cols } as _, col (col)}
				<Skeleton class={cn('h-4', col === 0 ? 'w-6' : 'flex-1')} />
			{/each}
		</div>
	{/each}
	<span class="sr-only">Loading…</span>
</div>
