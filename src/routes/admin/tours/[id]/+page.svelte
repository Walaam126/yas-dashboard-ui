<script lang="ts">
	import type { PageData } from './$types';
	import TourDetail from '$lib/components/tours/TourDetail.svelte';

	let { data }: { data: PageData } = $props();
</script>

<!-- Remount when switching tours so local status and form state follow the record. -->
{#key data.tour.id}
	<TourDetail tour={data.tour} requests={data.requests} statusForm={data.statusForm} />
{/key}
