<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';

	type Props = {
		class?: string;
		children: Snippet;
	} & Omit<DropdownMenuPrimitive.GroupHeadingProps, 'class' | 'children'>;

	let { class: className, children, ...rest }: Props = $props();
</script>

<DropdownMenuPrimitive.GroupHeading
	class={cn('border-b border-beige-border px-4 py-2.5', className)}
	{...rest}
>
	{@render children()}
</DropdownMenuPrimitive.GroupHeading>
