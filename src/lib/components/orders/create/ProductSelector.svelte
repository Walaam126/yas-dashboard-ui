<script lang="ts">
	import type { OrderType, Product } from '$lib/types';
	import StatusBadge from '$lib/components/dashboard/StatusBadge.svelte';
	import SearchField from '$lib/components/shared/SearchField.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';
	import { bhd, orderTypeMap } from '$lib/utils';
	import CheckIcon from '@lucide/svelte/icons/check';
	import PlusIcon from '@lucide/svelte/icons/plus';

	type Props = {
		open: boolean;
		products: Product[];
		/** Products that cannot be ordered under this type are shown but blocked. */
		orderType: OrderType;
		addedIds: string[];
		onadd: (product: Product) => void;
	};

	let { open = $bindable(false), products, orderType, addedIds, onadd }: Props = $props();

	let query = $state('');

	let results = $derived.by(() => {
		const needle = query.trim().toLowerCase();
		if (!needle) return products;
		return products.filter(
			(product) =>
				product.name.toLowerCase().includes(needle) ||
				product.brand.toLowerCase().includes(needle) ||
				product.sku.toLowerCase().includes(needle)
		);
	});

	/** Why this product cannot be added right now, in plain words. */
	function blockedReason(product: Product): string | null {
		if (product.orderType !== orderType) {
			return `Only available as ${orderTypeMap[product.orderType].label}`;
		}
		if (product.stockStatus === 'out_stock') {
			return 'Out of stock right now';
		}
		return null;
	}

	function price(product: Product): number {
		return product.salePrice ?? product.price;
	}
</script>

<Sheet.Root bind:open>
	<Sheet.Content class="bg-background gap-0 data-[side=right]:w-full data-[side=right]:sm:max-w-lg">
		<Sheet.Header class="bg-card shrink-0 border-b px-5 py-4 pr-14">
			<Sheet.Title class="font-serif text-xl font-semibold">Add Product</Sheet.Title>
			<Sheet.Description class="text-xs">
				Search by product name or brand, then add it to the order.
			</Sheet.Description>
		</Sheet.Header>

		<div class="bg-card shrink-0 border-b px-5 py-3">
			<SearchField
				id="product-search"
				label="Search products"
				placeholder="Search by product name or brand"
				value={query}
				autocomplete="off"
				oninput={(event) => (query = event.currentTarget.value)}
			/>
		</div>

		<div class="flex-1 overflow-y-auto overscroll-contain">
			{#if results.length === 0}
				<p class="text-muted-foreground px-5 py-10 text-center text-sm">
					No products match that search.
				</p>
			{:else}
				<ul class="divide-border divide-y">
					{#each results as product (product.id)}
						{@const blocked = blockedReason(product)}
						{@const added = addedIds.includes(product.id)}
						<li class="flex items-center gap-3 px-5 py-3">
							<img
								src={product.image}
								alt={product.name}
								class="border-border h-14 w-14 shrink-0 rounded-lg border object-cover"
								loading="lazy"
							/>
							<div class="min-w-0 flex-1">
								<p class="text-foreground truncate font-medium">{product.name}</p>
								<p class="text-muted-foreground truncate text-xs">{product.brand}</p>
								<div class="mt-1.5 flex flex-wrap items-center gap-1.5">
									<span class="text-foreground text-sm font-medium">{bhd(price(product))}</span>
									<StatusBadge kind="stock" value={product.stockStatus} />
									{#if product.orderType !== 'ready'}
										<StatusBadge kind="orderType" value={product.orderType} />
									{/if}
								</div>
								{#if blocked}
									<p class="text-muted-foreground mt-1 text-xs">{blocked}</p>
								{/if}
							</div>
							{#if added}
								<span class="text-success flex shrink-0 items-center gap-1 text-sm font-medium">
									<CheckIcon class="h-4 w-4" aria-hidden="true" />
									Added
								</span>
							{:else}
								<Button
									variant="outline"
									size="sm"
									class="shrink-0"
									disabled={Boolean(blocked)}
									onclick={() => onadd(product)}
								>
									<PlusIcon class="h-4 w-4" aria-hidden="true" />
									Add
								</Button>
							{/if}
						</li>
					{/each}
				</ul>
			{/if}
		</div>

		<Sheet.Footer class="bg-card shrink-0 flex-row justify-end border-t px-5 py-4">
			<Button onclick={() => (open = false)}>Done</Button>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
