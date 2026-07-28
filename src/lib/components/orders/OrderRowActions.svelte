<script lang="ts">
	import type { Order } from '$lib/types';
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button';
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
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button variant="ghost" size="icon-sm" class="text-muted-foreground" {...props}>
				<MoreHorizontalIcon class="h-4 w-4" aria-hidden="true" />
				<span class="sr-only">Actions for order {order.number}</span>
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
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
		<DropdownMenu.Item variant="destructive" onSelect={() => oncancel(order)}>
			<XCircleIcon class="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
			Cancel order
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
