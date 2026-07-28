<script lang="ts">
	import type { Product } from '$lib/types';
	import { resolve } from '$app/paths';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import MoreHorizontalIcon from '@lucide/svelte/icons/ellipsis';
	import EyeOffIcon from '@lucide/svelte/icons/eye-off';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import { toast } from 'svelte-sonner';

	type Props = {
		product: Product;
		ondelete: (product: Product) => void;
	};

	let { product, ondelete }: Props = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-espresso-muted transition-colors hover:bg-cream-200 hover:text-espresso"
	>
		<MoreHorizontalIcon class="h-4 w-4" aria-hidden="true" />
		<span class="sr-only">Actions for {product.name}</span>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Item>
			{#snippet child({ props })}
				<a href={resolve('/admin/products/[id]', { id: product.id })} {...props}>
					<PencilIcon class="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
					Edit product
				</a>
			{/snippet}
		</DropdownMenu.Item>
		<DropdownMenu.Item onSelect={() => toast.success(`${product.name} duplicated`)}>
			<CopyIcon class="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
			Duplicate
		</DropdownMenu.Item>
		<DropdownMenu.Item onSelect={() => toast(`${product.name} hidden`)}>
			<EyeOffIcon class="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
			Hide
		</DropdownMenu.Item>
		<DropdownMenu.Item destructive onSelect={() => ondelete(product)}>
			<Trash2Icon class="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
			Delete
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
