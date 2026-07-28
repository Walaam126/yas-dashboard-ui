<script lang="ts">
	import { cn } from '$lib/utils';
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
	import type { Snippet } from 'svelte';

	type Props = {
		class?: string;
		children: Snippet;
	} & Omit<DropdownMenuPrimitive.ContentProps, 'class' | 'children'>;

	let { class: className, sideOffset = 4, align = 'end', children, ...rest }: Props = $props();
</script>

<DropdownMenuPrimitive.Portal>
	<DropdownMenuPrimitive.Content
		{sideOffset}
		{align}
		class={cn(
			'z-50 min-w-[180px] rounded-lg border border-beige-border bg-surface py-1 shadow-drawer outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95',
			className
		)}
		{...rest}
	>
		{@render children()}
	</DropdownMenuPrimitive.Content>
</DropdownMenuPrimitive.Portal>
