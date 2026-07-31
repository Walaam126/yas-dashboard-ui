<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { FilterConfig } from './FilterControls.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';
	import SlidersHorizontalIcon from '@lucide/svelte/icons/sliders-horizontal';
	import FilterControls from './FilterControls.svelte';
	import SearchInput from './SearchInput.svelte';

	type Props = {
		filters: FilterConfig[];
		values: Record<string, string>;
		searchValue: string;
		searchLabel: string;
		searchPlaceholder: string;
		/** Viewport width at which the filter selects move inline. */
		breakpoint?: 'lg' | 'xl';
		activeCount: number;
		onchange: (key: string, value: string) => void;
		onsearch: (value: string) => void;
		onreset: () => void;
		/** Extra controls pinned to the right of the bar, e.g. a view switcher. */
		trailing?: Snippet;
	};

	let {
		filters,
		values,
		searchValue,
		searchLabel,
		searchPlaceholder,
		breakpoint = 'lg',
		activeCount,
		onchange,
		onsearch,
		onreset,
		trailing
	}: Props = $props();

	let drawerOpen = $state(false);

	// Tailwind needs whole class names, so the two breakpoints are spelled out.
	let inlineClass = $derived(
		breakpoint === 'xl'
			? 'hidden flex-wrap items-center gap-2 xl:flex'
			: 'hidden flex-wrap items-center gap-2 lg:flex'
	);
	let triggerClass = $derived(breakpoint === 'xl' ? 'xl:hidden' : 'lg:hidden');
</script>

<div class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
	<SearchInput
		value={searchValue}
		label={searchLabel}
		placeholder={searchPlaceholder}
		class="lg:max-w-xs lg:flex-1"
		{onsearch}
	/>

	<div class={inlineClass}>
		<FilterControls {filters} {values} {onchange} />
	</div>

	<div class="flex items-center gap-2 lg:ml-auto">
		<Button variant="outline" class={triggerClass} onclick={() => (drawerOpen = true)}>
			<SlidersHorizontalIcon class="h-4 w-4" aria-hidden="true" />
			Filters
			{#if activeCount > 0}
				<span class="bg-primary text-primary-foreground ml-1 rounded-full px-1.5 text-xs">
					{activeCount}
				</span>
			{/if}
		</Button>
		{#if trailing}
			{@render trailing()}
		{/if}
	</div>
</div>

<Sheet.Root bind:open={drawerOpen}>
	<Sheet.Content side="bottom" class="bg-background max-h-[85vh] gap-0 rounded-t-2xl">
		<Sheet.Header class="bg-card shrink-0 border-b px-5 py-4">
			<Sheet.Title class="font-serif text-xl font-semibold">Filters</Sheet.Title>
			<Sheet.Description class="sr-only">
				Narrow the list down by the options below.
			</Sheet.Description>
		</Sheet.Header>

		<div class="flex-1 space-y-4 overflow-y-auto overscroll-contain p-5">
			<FilterControls {filters} {values} {onchange} idPrefix="drawer-filter" itemClass="block" />
		</div>

		<Sheet.Footer class="bg-card shrink-0 flex-row gap-3 border-t px-5 py-4">
			<Button
				variant="outline"
				class="flex-1"
				onclick={() => {
					onreset();
					drawerOpen = false;
				}}
			>
				Reset
			</Button>
			<Button class="flex-1" onclick={() => (drawerOpen = false)}>Apply</Button>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
