<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLLabelAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	type Props = {
		class?: string;
		children: Snippet;
	} & Omit<HTMLLabelAttributes, 'class' | 'children'>;

	let { class: className, children, ...rest }: Props = $props();
</script>

<label class={cn('block text-sm font-medium text-espresso', className)} {...rest}>
	{@render children()}
</label>
