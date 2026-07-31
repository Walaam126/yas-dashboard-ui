<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Label } from '$lib/components/ui/label';

	type ControlProps = {
		id: string;
		'aria-invalid': 'true' | undefined;
		'aria-describedby': string | undefined;
	};

	/**
	 * The sign-in form runs on a larger, airier scale than the dashboard forms, so
	 * it keeps its own wrapper rather than restyling the shared `Field`. The
	 * Superforms contract is identical — the control is handed its `id` and the
	 * `aria-invalid` / `aria-describedby` pair, and the message Superforms
	 * produced is rendered directly beneath it.
	 */
	type Props = {
		/** Also the control's `id`, so it must be unique on the page. */
		id: string;
		label: string;
		/** Validation messages for this field, straight from Superforms. */
		errors?: string[] | undefined;
		control: Snippet<[ControlProps]>;
	};

	let { id, label, errors, control }: Props = $props();

	let invalid = $derived(Boolean(errors?.length));
	let errorId = $derived(invalid ? `${id}-error` : undefined);
</script>

<div>
	<Label for={id} class="text-espresso mb-2 block text-sm font-medium sm:mb-2.5 sm:text-[15px]"
		>{label}</Label
	>

	{@render control({
		id,
		'aria-invalid': invalid ? 'true' : undefined,
		'aria-describedby': errorId
	})}

	{#if invalid}
		<p id={errorId} class="text-danger mt-1.5 text-[13px] font-medium">{errors?.[0]}</p>
	{/if}
</div>
