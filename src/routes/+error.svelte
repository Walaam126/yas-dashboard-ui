<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import CompassIcon from '@lucide/svelte/icons/compass';
</script>

<svelte:head>
	<title>{page.status} — YAS Outlet Admin</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-cream px-4">
	<div
		class="w-full max-w-md rounded-xl border border-beige-border bg-surface p-8 text-center shadow-card"
	>
		<div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold-soft">
			<CompassIcon class="h-6 w-6 text-gold-dark" strokeWidth={1.75} aria-hidden="true" />
		</div>
		<p class="font-serif text-4xl font-semibold text-espresso">{page.status}</p>
		<h1 class="mt-2 font-serif text-xl text-espresso">
			{page.status === 404 ? 'Page not found' : 'Something went wrong'}
		</h1>
		<p class="mt-1.5 text-sm text-espresso-muted">
			{page.error?.message ?? 'The page you were looking for is not available.'}
		</p>
		<Button href="/admin" class="mt-6">Back to Overview</Button>
	</div>
</div>
