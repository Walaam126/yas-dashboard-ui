<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Badge } from '$lib/components/ui/badge';

	type Props = {
		title: string;
		description?: string;
		count?: string;
		actions?: Snippet;
	};

	let { title, description, count, actions }: Props = $props();
</script>

<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
	<div class="min-w-0">
		<div class="flex flex-wrap items-center gap-3">
			<h1 class="font-serif text-2xl font-semibold sm:text-3xl">{title}</h1>
			{#if count}
				<Badge class="bg-muted text-muted-foreground px-2.5">{count}</Badge>
			{/if}
		</div>
		{#if description}
			<p class="mt-1 text-sm text-muted-foreground">{description}</p>
		{/if}
	</div>
	{#if actions}
		<div class="flex flex-wrap items-center gap-2">{@render actions()}</div>
	{/if}
</div>
