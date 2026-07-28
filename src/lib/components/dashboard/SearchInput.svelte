<script lang="ts">
	import { cn } from '$lib/utils';
	import SearchIcon from '@lucide/svelte/icons/search';

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

<search class={cn('relative', className)}>
	<form onsubmit={handleSubmit} role="search">
		<label class="sr-only" for="{name}-search">{label}</label>
		<SearchIcon
			class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-espresso-muted"
			aria-hidden="true"
		/>
		<input
			id="{name}-search"
			{name}
			type="search"
			value={draft}
			oninput={handleInput}
			{placeholder}
			class="h-10 w-full rounded-lg border border-beige-border bg-surface pr-3 pl-9 text-sm text-espresso transition-colors placeholder:text-espresso-muted/60 focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none"
		/>
	</form>
</search>
