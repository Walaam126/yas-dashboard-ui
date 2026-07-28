<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	type ControlProps = {
		id: string;
		'aria-invalid': 'true' | undefined;
		'aria-describedby': string | undefined;
	};

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
		<label for={id} class="mb-1.5 block text-sm font-medium text-espresso">{label}</label>
	{/if}

	{@render control({
		id,
		'aria-invalid': invalid ? 'true' : undefined,
		'aria-describedby': describedBy
	})}

	{#if invalid}
		<p id={errorId} class="mt-1 text-xs font-medium text-danger">{errors?.[0]}</p>
	{:else if hint}
		<p id={hintId} class="mt-1 text-xs text-espresso-muted">{hint}</p>
	{/if}
</div>
