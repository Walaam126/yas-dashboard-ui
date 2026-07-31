<script lang="ts">
	import type { NewOrderValues, OrderLineValues } from '$lib/schemas';
	import type { Product, Tour } from '$lib/types';
	import type { SuperForm } from 'sveltekit-superforms';
	import OrderLineItem from '$lib/components/orders/create/OrderLineItem.svelte';
	import OrderTypeSelector from '$lib/components/orders/create/OrderTypeSelector.svelte';
	import ProductSelector from '$lib/components/orders/create/ProductSelector.svelte';
	import EmptyState from '$lib/components/shared/EmptyState.svelte';
	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import { orderTypeMap } from '$lib/utils';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import ShoppingBagIcon from '@lucide/svelte/icons/shopping-bag';
	import { untrack } from 'svelte';

	type Props = {
		form: SuperForm<NewOrderValues>;
		products: Product[];
		tours: Tour[];
	};

	let { form, products, tours }: Props = $props();

	const { form: values, errors } = untrack(() => form);

	let selectorOpen = $state(false);

	let addedIds = $derived($values.items.map((line) => line.productId));
	let mismatchCount = $derived(
		$values.items.filter((line) => line.orderType !== $values.orderType).length
	);
	let typeLabel = $derived(orderTypeMap[$values.orderType].label);

	function productFor(line: OrderLineValues): Product | undefined {
		return products.find((product) => product.id === line.productId);
	}

	function addProduct(product: Product) {
		$values.items = [
			...$values.items,
			{
				key: `${product.id}-${$values.items.length}-${Date.now()}`,
				productId: product.id,
				name: product.name,
				brand: product.brand,
				image: product.image,
				orderType: product.orderType,
				size: product.sizes[0] ?? 'One Size',
				color: product.colors[0] ?? '',
				qty: 1,
				price: product.salePrice ?? product.price
			}
		];
	}

	function patch(key: string, changes: Partial<OrderLineValues>) {
		$values.items = $values.items.map((line) =>
			line.key === key ? { ...line, ...changes } : line
		);
	}

	function remove(key: string) {
		$values.items = $values.items.filter((line) => line.key !== key);
	}

	function removeMismatched() {
		$values.items = $values.items.filter((line) => line.orderType === $values.orderType);
	}
</script>

<div class="space-y-4 p-5">
	<OrderTypeSelector {form} {tours} />

	{#if mismatchCount > 0}
		<Alert.Root class="border-danger-border bg-danger-soft text-danger">
			<Alert.Description class="text-danger flex flex-wrap items-center justify-between gap-3">
				<span>
					{mismatchCount === 1 ? '1 product is' : `${mismatchCount} products are`} not available as
					{typeLabel}.
				</span>
				<Button variant="outline" size="sm" onclick={removeMismatched}>Remove them</Button>
			</Alert.Description>
		</Alert.Root>
	{/if}

	{#if $values.items.length === 0}
		<div class="border-border rounded-lg border border-dashed">
			<EmptyState
				icon={ShoppingBagIcon}
				title="No products added yet."
				description="Search the catalogue and add the products for this order."
				actionLabel="Add Product"
				onaction={() => (selectorOpen = true)}
			/>
		</div>
	{:else}
		<ul class="border-border divide-border divide-y overflow-hidden rounded-lg border">
			{#each $values.items as line (line.key)}
				{@const product = productFor(line)}
				<OrderLineItem
					{line}
					sizes={product?.sizes ?? []}
					colors={product?.colors ?? []}
					warning={line.orderType === $values.orderType
						? undefined
						: `Not available as ${typeLabel}`}
					onqty={(qty) => patch(line.key, { qty })}
					onsize={(size) => patch(line.key, { size })}
					oncolor={(color) => patch(line.key, { color })}
					onremove={() => remove(line.key)}
				/>
			{/each}
		</ul>

		<Button variant="outline" class="w-full sm:w-auto" onclick={() => (selectorOpen = true)}>
			<PlusIcon class="h-4 w-4" aria-hidden="true" />
			Add Another Product
		</Button>
	{/if}

	{#if $errors.items?._errors?.[0]}
		<p class="text-danger text-xs font-medium">{$errors.items._errors[0]}</p>
	{/if}
</div>

<ProductSelector
	bind:open={selectorOpen}
	{products}
	orderType={$values.orderType}
	{addedIds}
	onadd={addProduct}
/>
