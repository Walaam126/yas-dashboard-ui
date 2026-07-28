<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLTdAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	type Props = {
		class?: string;
		children?: Snippet;
	} & Omit<HTMLTdAttributes, 'class' | 'children'>;

	let { class: className, children, ...rest }: Props = $props();
</script>

<td class={cn('px-3 py-3', className)} {...rest}>
	{#if children}{@render children()}{/if}
</td>
