<script lang="ts">
	import { cn } from '$lib/utils';
	import CheckIcon from '@lucide/svelte/icons/check';
	import MinusIcon from '@lucide/svelte/icons/minus';
	import { Checkbox as CheckboxPrimitive } from 'bits-ui';

	type Props = {
		class?: string;
	} & Omit<CheckboxPrimitive.RootProps, 'class'>;

	let {
		class: className,
		checked = $bindable(false),
		indeterminate = $bindable(false),
		...rest
	}: Props = $props();
</script>

<CheckboxPrimitive.Root
	bind:checked
	bind:indeterminate
	class={cn(
		'inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border border-camel-dark bg-surface text-white transition-colors data-[state=checked]:border-gold data-[state=checked]:bg-gold data-[state=indeterminate]:border-gold data-[state=indeterminate]:bg-gold disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
	{...rest}
>
	{#snippet children({ checked: isChecked, indeterminate: isIndeterminate })}
		{#if isIndeterminate}
			<MinusIcon class="h-3 w-3" strokeWidth={3} aria-hidden="true" />
		{:else if isChecked}
			<CheckIcon class="h-3 w-3" strokeWidth={3} aria-hidden="true" />
		{/if}
	{/snippet}
</CheckboxPrimitive.Root>
