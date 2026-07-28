<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';

	type Props = {
		class?: string;
		children: Snippet;
	} & Omit<AlertDialogPrimitive.TitleProps, 'class' | 'children'>;

	let { class: className, children, ...rest }: Props = $props();
</script>

<AlertDialogPrimitive.Title
	class={cn('font-serif text-xl font-semibold text-espresso', className)}
	{...rest}
>
	{@render children()}
</AlertDialogPrimitive.Title>
