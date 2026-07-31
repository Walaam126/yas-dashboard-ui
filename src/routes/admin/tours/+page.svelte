<script lang="ts">
	import type { PageData } from './$types';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import CardSkeleton from '$lib/components/shared/CardSkeleton.svelte';
	import TourCard from '$lib/components/tours/TourCard.svelte';
	import TourFormFields from '$lib/components/tours/TourFormFields.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';
	import { tourSchema } from '$lib/schemas';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import { untrack } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	let { data }: { data: PageData } = $props();

	let createOpen = $state(false);

	const form = superForm(
		untrack(() => data.createForm),
		{
			validators: zod4Client(tourSchema),
			dataType: 'json',
			onUpdated: ({ form: result }) => {
				if (result.valid && result.message) {
					toast.success(result.message);
					createOpen = false;
				}
			}
		}
	);
	const { enhance, submitting } = form;
</script>

<svelte:head>
	<title>Tours — YAS Outlet Admin</title>
</svelte:head>

<PageHeader
	title="Tours"
	count="{data.total} tours"
	description="Plan and manage scheduled shopping trips where customers request products."
>
	{#snippet actions()}
		<Button onclick={() => (createOpen = true)}>
			<PlusIcon class="h-4 w-4" aria-hidden="true" />
			Create Tour
		</Button>
	{/snippet}
</PageHeader>

<div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
	{#await data.results}
		{#each { length: 3 } as _, index (index)}
			<CardSkeleton />
		{/each}
	{:then tours}
		{#each tours as tour (tour.id)}
			<TourCard {tour} />
		{/each}
	{/await}
</div>

<Sheet.Root bind:open={createOpen}>
	<Sheet.Content class="bg-background gap-0 data-[side=right]:sm:max-w-xl">
		<Sheet.Header class="bg-card shrink-0 border-b px-5 py-4">
			<Sheet.Title class="font-serif text-xl font-semibold">Create Tour</Sheet.Title>
			<Sheet.Description class="text-xs">Set up a new shopping trip.</Sheet.Description>
		</Sheet.Header>

		<div class="flex-1 overflow-y-auto overscroll-contain p-5">
			<form id="create-tour-form" method="POST" action="?/createTour" use:enhance>
				<TourFormFields {form} />
			</form>
		</div>

		<Sheet.Footer class="bg-card shrink-0 flex-row justify-end gap-3 border-t px-5 py-4">
			<Button variant="outline" onclick={() => (createOpen = false)}>Cancel</Button>
			<Button type="submit" form="create-tour-form" disabled={$submitting}>
				{$submitting ? 'Creating…' : 'Create Tour'}
			</Button>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
