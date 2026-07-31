<script lang="ts" module>
	export interface FilterOption {
		value: string;
		label: string;
	}

	export interface FilterConfig {
		key: string;
		label: string;
		options: FilterOption[];
	}
</script>

<script lang="ts">
	import SelectField from '$lib/components/shared/SelectField.svelte';
	import { cn } from '$lib/utils';

	type Props = {
		filters: FilterConfig[];
		values: Record<string, string>;
		/**
		 * Namespaces the control ids. The bar renders one copy inline and one in
		 * the mobile drawer, so each set needs its own ids for the labels to bind.
		 */
		idPrefix?: string;
		/** Wrapper class per control — `block` stacks them inside the mobile drawer. */
		itemClass?: string;
		onchange: (key: string, value: string) => void;
	};

	let { filters, values, idPrefix = 'filter', itemClass, onchange }: Props = $props();
</script>

{#each filters as filter (filter.key)}
	<div class={cn(itemClass)}>
		<label class="sr-only" for="{idPrefix}-{filter.key}">{filter.label}</label>
		<SelectField
			id="{idPrefix}-{filter.key}"
			value={values[filter.key] ?? 'all'}
			options={[{ value: 'all', label: `${filter.label}: All` }, ...filter.options]}
			onValueChange={(value) => onchange(filter.key, value)}
			class="min-w-[140px]"
		/>
	</div>
{/each}
