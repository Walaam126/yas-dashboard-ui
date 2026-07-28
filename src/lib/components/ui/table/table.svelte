<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	type Props = {
		/** Minimum width before the wrapper starts scrolling horizontally. */
		minWidthClass?: string;
		class?: string;
		children: Snippet;
	};

	let { minWidthClass = 'min-w-[900px]', class: className, children }: Props = $props();
</script>

<!-- The wrapper owns the horizontal scroll so the page itself never scrolls sideways. -->
<div class="w-full overflow-x-auto">
	<table class={cn('w-full text-sm', minWidthClass, className)}>
		{@render children()}
	</table>
</div>
