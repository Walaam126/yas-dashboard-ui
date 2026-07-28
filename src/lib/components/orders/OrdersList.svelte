<script lang="ts">
	import type { Order } from '$lib/types';
	import { resolve } from '$app/paths';
	import StatusBadge from '$lib/components/dashboard/StatusBadge.svelte';
	import OrderRowActions from '$lib/components/orders/OrderRowActions.svelte';
	import EmptyState from '$lib/components/shared/EmptyState.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Table from '$lib/components/ui/table';
	import { bhd, formatDate } from '$lib/utils';
	import InboxIcon from '@lucide/svelte/icons/inbox';
	import { toast } from 'svelte-sonner';

	type Props = {
		orders: Order[];
		oncancel: (order: Order) => void;
	};

	let { orders, oncancel }: Props = $props();

	let selected = $state<string[]>([]);

	// Rows can disappear behind a filter change; drop them from the selection too.
	$effect(() => {
		const visible = new Set(orders.map((order) => order.id));
		if (selected.some((id) => !visible.has(id))) {
			selected = selected.filter((id) => visible.has(id));
		}
	});

	let allSelected = $derived(orders.length > 0 && selected.length === orders.length);

	function toggleAll() {
		selected = allSelected ? [] : orders.map((order) => order.id);
	}

	function toggleOne(id: string) {
		selected = selected.includes(id)
			? selected.filter((current) => current !== id)
			: [...selected, id];
	}
</script>

{#if selected.length > 0}
	<div
		class="border-primary/30 bg-gold-soft mb-3 flex items-center justify-between gap-3 rounded-lg border px-4 py-2.5"
	>
		<span class="text-gold-dark text-sm font-medium">{selected.length} selected</span>
		<div class="flex gap-2">
			<Button
				size="sm"
				variant="outline"
				onclick={() => {
					toast.success(`${selected.length} orders exported`);
					selected = [];
				}}
			>
				Export
			</Button>
			<Button size="sm" variant="outline" onclick={() => (selected = [])}>Clear</Button>
		</div>
	</div>
{/if}

<Card>
	{#if orders.length === 0}
		<EmptyState
			icon={InboxIcon}
			title="No orders found"
			description="No orders match your current filters. Try adjusting your search or tab."
		/>
	{:else}
		<!-- Desktop table -->
		<div class="hidden md:block">
			<Table.Root class="min-w-[900px]">
				<Table.Header>
					<Table.Row class="hover:bg-transparent">
						<Table.Head class="w-10 px-4">
							<Checkbox
								checked={allSelected}
								indeterminate={selected.length > 0 && !allSelected}
								onCheckedChange={toggleAll}
								aria-label="Select all orders"
							/>
						</Table.Head>
						<Table.Head>Order</Table.Head>
						<Table.Head>Customer</Table.Head>
						<Table.Head>Type</Table.Head>
						<Table.Head>Items</Table.Head>
						<Table.Head>Total</Table.Head>
						<Table.Head>Payment</Table.Head>
						<Table.Head>Status</Table.Head>
						<Table.Head>Date</Table.Head>
						<Table.Head class="w-10"><span class="sr-only">Actions</span></Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each orders as order (order.id)}
						<Table.Row data-state={selected.includes(order.id) ? 'selected' : undefined}>
							<Table.Cell class="px-4">
								<Checkbox
									checked={selected.includes(order.id)}
									onCheckedChange={() => toggleOne(order.id)}
									aria-label="Select {order.number}"
								/>
							</Table.Cell>
							<Table.Cell class="font-medium">
								<a href={resolve('/admin/orders/[id]', { id: order.id })} class="hover:text-gold-dark">
									{order.number}
									<span class="sr-only">— view order details</span>
								</a>
							</Table.Cell>
							<Table.Cell class="text-espresso-light">{order.customer}</Table.Cell>
							<Table.Cell><StatusBadge kind="orderType" value={order.type} /></Table.Cell>
							<Table.Cell class="text-muted-foreground">{order.items.length}</Table.Cell>
							<Table.Cell class="font-medium">{bhd(order.total)}</Table.Cell>
							<Table.Cell><StatusBadge kind="payment" value={order.payment} /></Table.Cell>
							<Table.Cell><StatusBadge kind="orderStatus" value={order.status} /></Table.Cell>
							<Table.Cell class="text-muted-foreground">{formatDate(order.date)}</Table.Cell>
							<Table.Cell>
								<OrderRowActions {order} {oncancel} />
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>

		<!-- Mobile cards -->
		<ul class="divide-border divide-y md:hidden">
			{#each orders as order (order.id)}
				<li class="hover:bg-muted/50 flex items-start gap-3 px-4 py-4">
					<div class="min-w-0 flex-1">
						<div class="flex items-center justify-between gap-3">
							<a
								href={resolve('/admin/orders/[id]', { id: order.id })}
								class="hover:text-gold-dark font-medium"
							>
								{order.number}
							</a>
							<span class="font-medium">{bhd(order.total)}</span>
						</div>
						<p class="text-espresso-light mt-1 text-sm">{order.customer}</p>
						<div class="mt-2 flex flex-wrap items-center gap-1.5">
							<StatusBadge kind="orderType" value={order.type} />
							<StatusBadge kind="orderStatus" value={order.status} />
							<StatusBadge kind="payment" value={order.payment} />
						</div>
						<p class="text-muted-foreground mt-2 text-xs">
							{formatDate(order.date)} · {order.items.length} items
						</p>
					</div>
					<OrderRowActions {order} {oncancel} />
				</li>
			{/each}
		</ul>
	{/if}
</Card>
