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
	import { Select } from '$lib/components/ui/select';
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
		<Select
			id="{idPrefix}-{filter.key}"
			value={values[filter.key] ?? 'all'}
			onchange={(event) => onchange(filter.key, event.currentTarget.value)}
			class="min-w-[140px]"
		>
			<option value="all">{filter.label}: All</option>
			{#each filter.options as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</div>
{/each}
