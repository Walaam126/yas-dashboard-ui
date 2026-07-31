<script lang="ts">
	import SearchField from '$lib/components/shared/SearchField.svelte';
	import { cn } from '$lib/utils';

	type Props = {
		value: string;
		name?: string;
		placeholder?: string;
		label: string;
		class?: string;
		/** Called after the user pauses typing, so the URL is not rewritten per keystroke. */
		onsearch: (value: string) => void;
	};

	let {
		value,
		name = 'q',
		placeholder = 'Search…',
		label,
		class: className,
		onsearch
	}: Props = $props();

	// A writable derived: the field follows the URL (reset, back button) but the
	// user can still type into it between navigations.
	let draft = $derived(value);
	let timer: ReturnType<typeof setTimeout> | undefined;

	function handleInput(event: Event & { currentTarget: HTMLInputElement }) {
		draft = event.currentTarget.value;
		clearTimeout(timer);
		const next = draft;
		timer = setTimeout(onsearch, 200, next);
	}

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		clearTimeout(timer);
		onsearch(draft);
	}
</script>

<search class={cn(className)}>
	<form onsubmit={handleSubmit} role="search">
		<SearchField
			id="{name}-search"
			{label}
			{name}
			{placeholder}
			value={draft}
			oninput={handleInput}
		/>
	</form>
</search>
