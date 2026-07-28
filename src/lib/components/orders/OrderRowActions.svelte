<script lang="ts">
	import type { Order } from '$lib/types';
	import { resolve } from '$app/paths';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import CheckCircleIcon from '@lucide/svelte/icons/circle-check';
	import XCircleIcon from '@lucide/svelte/icons/circle-x';
	import MoreHorizontalIcon from '@lucide/svelte/icons/ellipsis';
	import EyeIcon from '@lucide/svelte/icons/eye';
	import PrinterIcon from '@lucide/svelte/icons/printer';
	import { toast } from 'svelte-sonner';

	type Props = {
		order: Order;
		oncancel: (order: Order) => void;
	};

	let { order, oncancel }: Props = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-espresso-muted transition-colors hover:bg-cream-200 hover:text-espresso"
	>
		<MoreHorizontalIcon class="h-4 w-4" aria-hidden="true" />
		<span class="sr-only">Actions for order {order.number}</span>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Item>
			{#snippet child({ props })}
				<a href={resolve('/admin/orders/[id]', { id: order.id })} {...props}>
					<EyeIcon class="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
					View details
				</a>
			{/snippet}
		</DropdownMenu.Item>
		<DropdownMenu.Item onSelect={() => toast.success(`${order.number} confirmed`)}>
			<CheckCircleIcon class="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
			Confirm order
		</DropdownMenu.Item>
		<DropdownMenu.Item onSelect={() => toast('Printing order…')}>
			<PrinterIcon class="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
			Print order
		</DropdownMenu.Item>
		<DropdownMenu.Item destructive onSelect={() => oncancel(order)}>
			<XCircleIcon class="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
			Cancel order
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
