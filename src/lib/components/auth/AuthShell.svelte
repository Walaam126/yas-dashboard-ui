<script lang="ts">
	import type { Snippet } from 'svelte';
	import * as Card from '$lib/components/ui/card';
	import { cn } from '$lib/utils';
	import PalmBackdrop from './PalmBackdrop.svelte';

	/**
	 * The page frame every auth screen shares: the palm-lit cream ground, the
	 * centred column, and the soft card the form sits on. Sign-in and password
	 * recovery must not drift apart, so the card geometry lives here once rather
	 * than being restated per route.
	 */
	let { class: className, children }: { class?: string; children: Snippet } = $props();
</script>

<!--
	`min-h-screen` rather than `h-screen`, so a short viewport lets the card grow
	the page and scroll instead of clipping the branding or the footer.
-->
<div
	class="bg-cream relative flex min-h-screen w-full items-center justify-center overflow-x-clip px-4 py-8 sm:px-6 sm:py-10"
>
	<PalmBackdrop />

	<main class="relative w-full max-w-100 sm:max-w-106">
		<Card.Root
			class={cn(
				'rounded-3xl border-0 px-6 pt-8 pb-6 shadow-[0_2px_10px_rgb(59_47_39/0.04),0_28px_64px_-16px_rgb(59_47_39/0.16)] sm:px-10 sm:pt-11 sm:pb-9',
				className
			)}
		>
			{@render children()}
		</Card.Root>
	</main>
</div>
