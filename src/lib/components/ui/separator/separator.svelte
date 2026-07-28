<script lang="ts">
	import { cn } from '$lib/utils';
	import { Separator as SeparatorPrimitive } from 'bits-ui';

	type Props = { class?: string } & Omit<SeparatorPrimitive.RootProps, 'class'>;

	let { class: className, orientation = 'horizontal', ...rest }: Props = $props();
</script>

<SeparatorPrimitive.Root
	{orientation}
	class={cn(
		'shrink-0 bg-beige-border',
		orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
		className
	)}
	{...rest}
/>
