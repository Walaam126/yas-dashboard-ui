<script lang="ts">
	import { cn } from '$lib/utils';
	import { Switch as SwitchPrimitive } from 'bits-ui';

	type Props = {
		class?: string;
	} & Omit<SwitchPrimitive.RootProps, 'class'>;

	let { class: className, checked = $bindable(false), ...rest }: Props = $props();
</script>

<SwitchPrimitive.Root
	bind:checked
	class={cn(
		'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50',
		checked ? 'bg-gold' : 'bg-camel',
		className
	)}
	{...rest}
>
	<SwitchPrimitive.Thumb
		class={cn(
			'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition-transform',
			checked ? 'translate-x-6' : 'translate-x-1'
		)}
	/>
</SwitchPrimitive.Root>
