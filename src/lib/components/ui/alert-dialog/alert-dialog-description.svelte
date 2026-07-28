<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';

	type Props = {
		class?: string;
		children: Snippet;
	} & Omit<AlertDialogPrimitive.DescriptionProps, 'class' | 'children'>;

	let { class: className, children, ...rest }: Props = $props();
</script>

<AlertDialogPrimitive.Description
	class={cn('mt-1.5 text-sm text-espresso-muted', className)}
	{...rest}
>
	{@render children()}
</AlertDialogPrimitive.Description>
