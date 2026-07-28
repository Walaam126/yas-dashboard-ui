<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import type { HTMLThAttributes } from 'svelte/elements';

	type Props = {
		class?: string;
		children?: Snippet;
	} & Omit<HTMLThAttributes, 'class' | 'children'>;

	let { class: className, children, ...rest }: Props = $props();
</script>

<th class={cn('px-3 py-3 font-medium', className)} scope="col" {...rest}>
	{#if children}{@render children()}{/if}
</th>
