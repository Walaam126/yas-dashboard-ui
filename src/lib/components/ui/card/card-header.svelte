<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	type Props = {
		title: string;
		/** Heading level, so a card header nests correctly in the page outline. */
		level?: 2 | 3;
		class?: string;
		action?: Snippet;
	};

	let { title, level = 2, class: className, action }: Props = $props();
</script>

<div
	class={cn(
		'flex items-center justify-between gap-3 border-b border-beige-border px-5 py-4',
		className
	)}
>
	{#if level === 2}
		<h2 class="font-serif text-lg font-semibold text-espresso">{title}</h2>
	{:else}
		<h3 class="font-serif text-lg font-semibold text-espresso">{title}</h3>
	{/if}
	{#if action}
		{@render action()}
	{/if}
</div>
