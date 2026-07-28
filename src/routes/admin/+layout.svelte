<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import Header from '$lib/components/layout/Header.svelte';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';

	let { children }: { children: Snippet } = $props();

	let mobileNavOpen = $state(false);
</script>

<div class="flex h-screen w-full overflow-hidden bg-cream">
	<Sidebar pathname={page.url.pathname} bind:mobileOpen={mobileNavOpen} />

	<div class="flex min-w-0 flex-1 flex-col">
		<Header onopenmobilenav={() => (mobileNavOpen = true)} />
		<main class="flex-1 overflow-y-auto">
			<div class="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
				{@render children()}
			</div>
		</main>
	</div>
</div>
