<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = {
		selected?: boolean;
		class?: string;
		children: Snippet;
	} & Omit<HTMLAttributes<HTMLTableRowElement>, 'class' | 'children'>;

	let { selected = false, class: className, children, ...rest }: Props = $props();
</script>

<tr
	class={cn(
		'transition-colors hover:bg-cream-100 has-focus-visible:bg-cream-100',
		selected && 'bg-gold-soft/40',
		className
	)}
	{...rest}
>
	{@render children()}
</tr>
