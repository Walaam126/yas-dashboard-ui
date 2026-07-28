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
		/** Wrapper class per control — `block` stacks them inside the mobile drawer. */
		itemClass?: string;
		onchange: (key: string, value: string) => void;
	};

	let { filters, values, itemClass, onchange }: Props = $props();
</script>

{#each filters as filter (filter.key)}
	<div class={cn(itemClass)}>
		<label class="sr-only" for="filter-{filter.key}">{filter.label}</label>
		<Select
			id="filter-{filter.key}"
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
