<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import type { HTMLLabelAttributes } from 'svelte/elements';

	type Props = {
		class?: string;
		children: Snippet;
	} & Omit<HTMLLabelAttributes, 'class' | 'children'>;

	let { class: className, children, ...rest }: Props = $props();
</script>

<label class={cn('block text-sm font-medium text-espresso', className)} {...rest}>
	{@render children()}
</label>
