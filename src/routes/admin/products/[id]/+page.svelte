<script lang="ts">
	import type { PageData } from './$types';
	import ProductForm from '$lib/components/products/ProductForm.svelte';
	import { IMAGES } from '$lib/data/images';

	let { data }: { data: PageData } = $props();

	// The mockup seeds the gallery with the product image plus two stand-ins.
	let initialGallery = $derived([data.product.image, IMAGES.bag, IMAGES.heels]);
</script>

<svelte:head>
	<title>{data.product.name} — YAS Outlet Admin</title>
</svelte:head>

<!-- Remount the form when switching products so its state matches the record. -->
{#key data.product.id}
	<ProductForm
		data={data.form}
		mode="edit"
		heading={data.product.name}
		{initialGallery}
		galleryOptions={data.galleryOptions}
		tours={data.tours}
	/>
{/key}
