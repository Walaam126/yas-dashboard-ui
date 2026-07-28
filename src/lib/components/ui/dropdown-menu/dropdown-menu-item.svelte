<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';

	type Props = {
		destructive?: boolean;
		class?: string;
		children?: Snippet;
	} & Omit<DropdownMenuPrimitive.ItemProps, 'class' | 'children'>;

	let { destructive = false, class: className, children, ...rest }: Props = $props();
</script>

<DropdownMenuPrimitive.Item
	class={cn(
		'flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-sm outline-none transition-colors select-none data-disabled:pointer-events-none data-disabled:opacity-50',
		destructive
			? 'text-danger data-highlighted:bg-danger-soft'
			: 'text-espresso data-highlighted:bg-cream-200',
		className
	)}
	{...rest}
>
	{#if children}{@render children()}{/if}
</DropdownMenuPrimitive.Item>
