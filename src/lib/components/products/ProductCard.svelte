<script lang="ts">
	import type { Product } from '$lib/types';
	import { resolve } from '$app/paths';
	import StatusBadge from '$lib/components/dashboard/StatusBadge.svelte';
	import ProductRowActions from '$lib/components/products/ProductRowActions.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';
	import { bhd } from '$lib/utils';
	import PencilIcon from '@lucide/svelte/icons/pencil';

	type Props = {
		product: Product;
		ondelete: (product: Product) => void;
	};

	let { product, ondelete }: Props = $props();
</script>

<Card class="overflow-hidden">
	<div class="relative aspect-square bg-background">
		<img src={product.image} alt={product.name} class="h-full w-full object-cover" loading="lazy" />
		<div class="absolute top-2 right-2">
			<StatusBadge kind="visibility" value={product.visibility} />
		</div>
	</div>
	<div class="p-4">
		<p class="text-xs text-muted-foreground">{product.brand}</p>
		<h3 class="truncate font-medium text-foreground">{product.name}</h3>
		<div class="mt-2 flex items-center justify-between gap-2">
			<span class="font-semibold text-foreground">
				{bhd(product.salePrice ?? product.price)}
			</span>
			<StatusBadge kind="stock" value={product.stockStatus} />
		</div>
		<div class="mt-3 flex gap-2">
			<Button
				size="sm"
				variant="outline"
				class="flex-1"
				href={resolve('/admin/products/[id]', { id: product.id })}
			>
				<PencilIcon class="h-3.5 w-3.5" aria-hidden="true" />
				Edit
			</Button>
			<ProductRowActions {product} {ondelete} />
		</div>
	</div>
</Card>
