<script lang="ts">
	import type { FilterConfig } from '$lib/components/dashboard/FilterControls.svelte';
	import type { Product } from '$lib/types';
	import type { PageData } from './$types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import FilterBar from '$lib/components/dashboard/FilterBar.svelte';
	import StatusBadge from '$lib/components/dashboard/StatusBadge.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import ProductCard from '$lib/components/products/ProductCard.svelte';
	import ProductRowActions from '$lib/components/products/ProductRowActions.svelte';
	import ConfirmAction from '$lib/components/shared/ConfirmAction.svelte';
	import EmptyState from '$lib/components/shared/EmptyState.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { PRODUCT_FILTER_KEYS } from '$lib/data/product-filters';
	import { activeFilterCount, applyParams, bhd, cn, formatDate } from '$lib/utils';
	import DownloadIcon from '@lucide/svelte/icons/download';
	import LayoutGridIcon from '@lucide/svelte/icons/layout-grid';
	import ListIcon from '@lucide/svelte/icons/list';
	import PackageIcon from '@lucide/svelte/icons/package';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import UploadIcon from '@lucide/svelte/icons/upload';
	import { toast } from 'svelte-sonner';

	let { data }: { data: PageData } = $props();

	const filterConfig: FilterConfig[] = [
		{
			key: 'category',
			label: 'Category',
			options: [
				{ value: 'Women', label: 'Women' },
				{ value: 'Men', label: 'Men' },
				{ value: 'Kids', label: 'Kids' }
			]
		},
		{
			key: 'productType',
			label: 'Type',
			options: [
				{ value: 'Bag', label: 'Bag' },
				{ value: 'Shoes', label: 'Shoes' },
				{ value: 'Clothes', label: 'Clothes' },
				{ value: 'Accessories', label: 'Accessories' }
			]
		},
		{
			key: 'orderType',
			label: 'Order Type',
			options: [
				{ value: 'ready', label: 'Ready to Ship' },
				{ value: 'preorder', label: 'Pre-order' },
				{ value: 'tour', label: 'Tour' }
			]
		},
		{
			key: 'stock',
			label: 'Stock',
			options: [
				{ value: 'in_stock', label: 'In Stock' },
				{ value: 'low_stock', label: 'Low Stock' },
				{ value: 'out_stock', label: 'Out of Stock' },
				{ value: 'not_tracked', label: 'Not Tracked' }
			]
		},
		{
			key: 'visibility',
			label: 'Visibility',
			options: [
				{ value: 'published', label: 'Published' },
				{ value: 'draft', label: 'Draft' },
				{ value: 'hidden', label: 'Hidden' }
			]
		}
	];

	let productToDelete = $state<Product | null>(null);
	let deleteOpen = $state(false);

	let filterValues = $derived({
		category: data.query.category,
		productType: data.query.productType,
		orderType: data.query.orderType,
		stock: data.query.stock,
		visibility: data.query.visibility
	});

	let activeFilters = $derived(activeFilterCount(page.url, PRODUCT_FILTER_KEYS));

	function requestDelete(product: Product) {
		productToDelete = product;
		deleteOpen = true;
	}

	function resetFilters() {
		applyParams(page.url, {
			category: null,
			productType: null,
			orderType: null,
			stock: null,
			visibility: null
		});
	}

	const viewButtonClass = 'flex h-10 w-10 items-center justify-center transition-colors';
</script>

<svelte:head>
	<title>Products — YAS Outlet Admin</title>
</svelte:head>

<PageHeader
	title="Products"
	count="{data.total} items"
	description="Your catalogue of bags, shoes, clothes and accessories."
>
	{#snippet actions()}
		<Button variant="secondary" onclick={() => toast('CSV import started')}>
			<UploadIcon class="h-4 w-4" aria-hidden="true" />
			Import
		</Button>
		<Button variant="secondary" onclick={() => toast.success('Catalogue exported')}>
			<DownloadIcon class="h-4 w-4" aria-hidden="true" />
			Export
		</Button>
		<Button href={resolve('/admin/products/new')}>
			<PlusIcon class="h-4 w-4" aria-hidden="true" />
			Add Product
		</Button>
	{/snippet}
</PageHeader>

<FilterBar
	filters={filterConfig}
	values={filterValues}
	searchValue={data.query.search}
	searchLabel="Search products"
	searchPlaceholder="Search products or brands…"
	breakpoint="xl"
	activeCount={activeFilters}
	onchange={(key, value) => applyParams(page.url, { [key]: value })}
	onsearch={(value) => applyParams(page.url, { q: value })}
	onreset={resetFilters}
>
	{#snippet trailing()}
		<div
			class="flex overflow-hidden rounded-lg border border-beige-border"
			role="group"
			aria-label="Product layout"
		>
			<button
				type="button"
				onclick={() => applyParams(page.url, { view: 'table' })}
				aria-pressed={data.view === 'table'}
				class={cn(
					viewButtonClass,
					data.view === 'table'
						? 'bg-espresso text-cream'
						: 'bg-surface text-espresso-muted hover:bg-cream-200'
				)}
			>
				<ListIcon class="h-4 w-4" aria-hidden="true" />
				<span class="sr-only">Table view</span>
			</button>
			<button
				type="button"
				onclick={() => applyParams(page.url, { view: 'grid' })}
				aria-pressed={data.view === 'grid'}
				class={cn(
					viewButtonClass,
					data.view === 'grid'
						? 'bg-espresso text-cream'
						: 'bg-surface text-espresso-muted hover:bg-cream-200'
				)}
			>
				<LayoutGridIcon class="h-4 w-4" aria-hidden="true" />
				<span class="sr-only">Grid view</span>
			</button>
		</div>
	{/snippet}
</FilterBar>

{#if data.products.length === 0}
	<Card>
		<EmptyState
			icon={PackageIcon}
			title="No products found"
			description="No products match your filters. Add a new product or adjust your search."
			actionLabel="Add Product"
			actionHref={resolve('/admin/products/new')}
		/>
	</Card>
{:else if data.view === 'grid'}
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		{#each data.products as product (product.id)}
			<ProductCard {product} ondelete={requestDelete} />
		{/each}
	</div>
{:else}
	<Card>
		<!-- Desktop table -->
		<div class="hidden lg:block">
			<Table.Root>
				<Table.HeaderRow>
					<Table.Head class="px-4">Product</Table.Head>
					<Table.Head>Category</Table.Head>
					<Table.Head>Order Type</Table.Head>
					<Table.Head>Price</Table.Head>
					<Table.Head>Stock</Table.Head>
					<Table.Head>Visibility</Table.Head>
					<Table.Head>Updated</Table.Head>
					<Table.Head class="w-10"><span class="sr-only">Actions</span></Table.Head>
				</Table.HeaderRow>
				<Table.Body>
					{#each data.products as product (product.id)}
						<Table.Row>
							<Table.Cell class="px-4">
								<div class="flex items-center gap-3">
									<img
										src={product.image}
										alt={product.name}
										class="h-11 w-11 rounded-lg border border-beige-border object-cover"
										loading="lazy"
									/>
									<div>
										<a
											href={resolve('/admin/products/[id]', { id: product.id })}
											class="font-medium text-espresso hover:text-gold-dark"
										>
											{product.name}
										</a>
										<p class="text-xs text-espresso-muted">
											{product.brand} · {product.sku}
										</p>
									</div>
								</div>
							</Table.Cell>
							<Table.Cell class="text-espresso-light">
								{product.category} · {product.productType}
							</Table.Cell>
							<Table.Cell><StatusBadge kind="orderType" value={product.orderType} /></Table.Cell>
							<Table.Cell>
								{#if product.salePrice}
									<span class="flex flex-col">
										<span class="font-medium text-espresso">{bhd(product.salePrice)}</span>
										<span class="text-xs text-espresso-muted line-through">
											{bhd(product.price)}
										</span>
									</span>
								{:else}
									<span class="font-medium text-espresso">{bhd(product.price)}</span>
								{/if}
							</Table.Cell>
							<Table.Cell>
								<div class="flex flex-col gap-0.5">
									<StatusBadge kind="stock" value={product.stockStatus} />
									{#if product.stockStatus !== 'not_tracked'}
										<span class="text-xs text-espresso-muted">{product.stock} available</span>
									{/if}
								</div>
							</Table.Cell>
							<Table.Cell><StatusBadge kind="visibility" value={product.visibility} /></Table.Cell>
							<Table.Cell class="text-espresso-muted">{formatDate(product.updated)}</Table.Cell>
							<Table.Cell>
								<ProductRowActions {product} ondelete={requestDelete} />
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>

		<!-- Mobile cards -->
		<ul class="divide-y divide-beige-border lg:hidden">
			{#each data.products as product (product.id)}
				<li class="flex gap-3 p-4">
					<img
						src={product.image}
						alt={product.name}
						class="h-16 w-16 shrink-0 rounded-lg border border-beige-border object-cover"
						loading="lazy"
					/>
					<div class="min-w-0 flex-1">
						<p class="text-xs text-espresso-muted">{product.brand}</p>
						<a
							href={resolve('/admin/products/[id]', { id: product.id })}
							class="block truncate font-medium text-espresso hover:text-gold-dark"
						>
							{product.name}
						</a>
						<div class="mt-1 flex flex-wrap items-center gap-1.5">
							<StatusBadge kind="stock" value={product.stockStatus} />
							<StatusBadge kind="visibility" value={product.visibility} />
						</div>
						<p class="mt-1 font-semibold text-espresso">
							{bhd(product.salePrice ?? product.price)}
						</p>
					</div>
					<ProductRowActions {product} ondelete={requestDelete} />
				</li>
			{/each}
		</ul>
	</Card>
{/if}

<ConfirmAction
	bind:open={deleteOpen}
	title="Delete this product?"
	description="This will permanently remove the product from your catalogue. This action cannot be undone."
	confirmLabel="Delete Product"
	onconfirm={() => {
		toast.success(`${productToDelete?.name} deleted`);
		productToDelete = null;
	}}
/>
