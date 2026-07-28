<script lang="ts">
	import type { PageData } from './$types';
	import ProductForm from '$lib/components/products/ProductForm.svelte';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Add Product — YAS Outlet Admin</title>
</svelte:head>

<ProductForm
	data={data.form}
	mode="create"
	heading="Add Product"
	initialGallery={[]}
	galleryOptions={data.galleryOptions}
	tours={data.tours}
/>
