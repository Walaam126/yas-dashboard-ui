<script lang="ts">
	import { cn } from '$lib/utils';
	import { Dialog as SheetPrimitive } from 'bits-ui';

	type Props = { class?: string } & Omit<SheetPrimitive.OverlayProps, 'class'>;

	let { class: className, ...rest }: Props = $props();
</script>

<SheetPrimitive.Overlay
	class={cn(
		'fixed inset-0 z-50 bg-espresso/40 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in',
		className
	)}
	{...rest}
/>
