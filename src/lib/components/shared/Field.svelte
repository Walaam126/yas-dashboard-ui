<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Label } from '$lib/components/ui/label';
	import { cn } from '$lib/utils';

	type ControlProps = {
		id: string;
		'aria-invalid': 'true' | undefined;
		'aria-describedby': string | undefined;
	};

	/**
	 * Superforms owns validation state in this app, so the field keeps its own
	 * wiring — it hands the control its `id` and the `aria-invalid` /
	 * `aria-describedby` pair, and renders the message Superforms produced. Only
	 * the label is delegated to the official shadcn-svelte primitive; the
	 * registry's `Field` set is form-library agnostic and would not connect the
	 * messages back to the store.
	 */
	type Props = {
		/** Also used as the control's `id`, so it must be unique on the page. */
		id: string;
		label?: string;
		hint?: string;
		/** Validation messages for this field, straight from Superforms. */
		errors?: string[] | undefined;
		class?: string;
		control: Snippet<[ControlProps]>;
	};

	let { id, label, hint, errors, class: className, control }: Props = $props();

	let invalid = $derived(Boolean(errors?.length));
	let hintId = $derived(hint ? `${id}-hint` : undefined);
	let errorId = $derived(invalid ? `${id}-error` : undefined);
	let describedBy = $derived([errorId, hintId].filter(Boolean).join(' ') || undefined);
</script>

<div class={cn('block', className)}>
	{#if label}
		<Label for={id} class="mb-1.5 block">{label}</Label>
	{/if}

	{@render control({
		id,
		'aria-invalid': invalid ? 'true' : undefined,
		'aria-describedby': describedBy
	})}

	{#if invalid}
		<p id={errorId} class="text-danger mt-1 text-xs font-medium">{errors?.[0]}</p>
	{:else if hint}
		<p id={hintId} class="text-muted-foreground mt-1 text-xs">{hint}</p>
	{/if}
</div>
