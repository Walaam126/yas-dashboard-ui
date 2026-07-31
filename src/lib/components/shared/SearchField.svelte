<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { Input } from '$lib/components/ui/input';
	import { cn } from '$lib/utils';
	import SearchIcon from '@lucide/svelte/icons/search';

	/**
	 * The single search control in the app: a visually hidden label, the search
	 * affordance, and the official Input. Every search box — the global one in
	 * the header, its mobile overlay, and the one on each list page — renders
	 * through here.
	 */
	type Props = {
		/** Ties the visually hidden label to the field; must be unique on the page. */
		id: string;
		label: string;
		/** Wrapper class, e.g. flex sizing inside a filter bar. */
		class?: string;
		/** Class for the input itself, e.g. a shorter control in the header. */
		inputClass?: string;
	} & Omit<HTMLInputAttributes, 'class' | 'id' | 'type' | 'files'>;

	let { id, label, class: className, inputClass, ...rest }: Props = $props();
</script>

<div class={cn('relative', className)}>
	<label class="sr-only" for={id}>{label}</label>
	<SearchIcon
		class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
		aria-hidden="true"
	/>
	<Input {id} type="search" class={cn('pr-3 pl-9', inputClass)} {...rest} />
</div>
