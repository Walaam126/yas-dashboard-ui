<script lang="ts">
	import { cn } from '$lib/utils';
	import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import AlertDialogOverlay from './alert-dialog-overlay.svelte';

	type Props = {
		class?: string;
		children: Snippet;
	} & Omit<AlertDialogPrimitive.ContentProps, 'class' | 'children'>;

	let { class: className, children, ...rest }: Props = $props();
</script>

<AlertDialogPrimitive.Portal>
	<AlertDialogOverlay />
	<AlertDialogPrimitive.Content
		class={cn(
			'fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-surface p-6 shadow-drawer outline-none',
			className
		)}
		{...rest}
	>
		{@render children()}
	</AlertDialogPrimitive.Content>
</AlertDialogPrimitive.Portal>
