<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent } from '$lib/components/ui/card';
	import CompassIcon from '@lucide/svelte/icons/compass';
</script>

<svelte:head>
	<title>{page.status} — YAS Outlet Admin</title>
</svelte:head>

<div class="bg-background flex min-h-screen items-center justify-center px-4">
	<Card class="w-full max-w-md">
		<CardContent class="p-8 text-center">
			<div class="bg-gold-soft mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full">
				<CompassIcon class="text-gold-dark h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
			</div>
			<p class="font-serif text-4xl font-semibold">{page.status}</p>
			<h1 class="mt-2 font-serif text-xl">
				{page.status === 404 ? 'Page not found' : 'Something went wrong'}
			</h1>
			<p class="text-muted-foreground mt-1.5 text-sm">
				{page.error?.message ?? 'The page you were looking for is not available.'}
			</p>
			<Button href="/admin" class="mt-6">Back to Overview</Button>
		</CardContent>
	</Card>
</div>
