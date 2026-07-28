<script lang="ts">
	import { cn } from '$lib/utils';
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';

	type Props = { class?: string } & Omit<DropdownMenuPrimitive.SeparatorProps, 'class'>;

	let { class: className, ...rest }: Props = $props();
</script>

<DropdownMenuPrimitive.Separator class={cn('my-1 h-px bg-beige-border', className)} {...rest} />
