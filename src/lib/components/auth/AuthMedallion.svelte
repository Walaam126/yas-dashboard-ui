<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import SparkleIcon from '@lucide/svelte/icons/sparkle';

	/**
	 * The soft gold disc that opens a single-purpose auth screen, with a few
	 * sparkles drifting off its edge. It carries the glyph it is handed and
	 * nothing else — the heading underneath does the talking — so the sparkles are
	 * decorative and stay out of the accessibility tree.
	 */
	let { class: className, children }: { class?: string; children: Snippet } = $props();
</script>

<div class={cn('relative mx-auto w-max', className)}>
	<SparkleIcon
		class="text-camel-dark/70 absolute -top-0.5 -left-2 size-3 sm:-left-2.5 sm:size-3.5"
		fill="currentColor"
		strokeWidth={1}
		aria-hidden="true"
	/>
	<SparkleIcon
		class="text-camel-dark/60 absolute top-2 -right-2.5 size-2.5 sm:-right-3 sm:size-3"
		fill="currentColor"
		strokeWidth={1}
		aria-hidden="true"
	/>
	<SparkleIcon
		class="text-camel-dark/45 absolute bottom-3 -left-3.5 size-2 sm:-left-4 sm:size-2.5"
		fill="currentColor"
		strokeWidth={1}
		aria-hidden="true"
	/>

	<div class="bg-gold-soft/80 grid size-18 place-content-center rounded-full sm:size-20">
		{@render children()}
	</div>
</div>
