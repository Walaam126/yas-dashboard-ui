<script lang="ts" module>
	export interface SelectFieldOption {
		value: string;
		label: string;
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { cn } from '$lib/utils';

	/**
	 * The single dropdown control in the app, composed from the official
	 * shadcn-svelte Select. The registry ships unopinionated primitives, so the
	 * three things every call site would otherwise repeat live here: the option
	 * loop, the trigger's selected-label lookup (there is no `Select.Value` in
	 * this registry style), and the `items` list that restores native-select
	 * typeahead and form autofill.
	 */
	type Props = {
		options: SelectFieldOption[];
		/** The selected value; bindable so Superforms can own it. */
		value?: string;
		/** Shown on the trigger while nothing is selected. */
		placeholder?: string;
		/** Renders the hidden input that carries the value on form submit. */
		name?: string;
		id?: string;
		disabled?: boolean;
		required?: boolean;
		/** Class for the trigger — sizing stays at the call site. */
		class?: string;
		'aria-invalid'?: 'true' | undefined;
		'aria-describedby'?: string | undefined;
		onValueChange?: (value: string) => void;
	};

	let {
		options,
		value = $bindable(''),
		placeholder = 'Select an option',
		name,
		id,
		disabled,
		required,
		class: className,
		onValueChange,
		...rest
	}: Props = $props();

	let selected = $derived(options.find((option) => option.value === value));
</script>

<Select.Root type="single" {name} {disabled} {required} items={options} bind:value {onValueChange}>
	<Select.Trigger {id} class={cn('w-full', className)} {...rest}>
		{selected?.label ?? placeholder}
	</Select.Trigger>
	<Select.Content>
		{#each options as option (option.value)}
			<Select.Item value={option.value} label={option.label} disabled={option.disabled} />
		{/each}
	</Select.Content>
</Select.Root>
