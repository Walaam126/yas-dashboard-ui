<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	type Props = {
		label: string;
		value?: string;
		tone?: 'default' | 'green';
		children?: Snippet;
	};

	let { label, value, tone = 'default', children }: Props = $props();
</script>

<div class="flex items-center justify-between gap-3">
	<span class="text-muted-foreground">{label}</span>
	<span class={cn('font-medium', tone === 'green' ? 'text-success' : 'text-foreground')}>
		{#if children}{@render children()}{:else}{value}{/if}
	</span>
</div>
