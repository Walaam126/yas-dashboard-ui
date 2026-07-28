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
		class="mb-3 flex items-center justify-between gap-3 rounded-lg border border-gold/30 bg-gold-soft px-4 py-2.5"
	>
		<span class="text-sm font-medium text-gold-dark">{selected.length} selected</span>
		<div class="flex gap-2">
			<Button
				size="sm"
				variant="secondary"
				onclick={() => {
					toast.success(`${selected.length} orders exported`);
					selected = [];
				}}
			>
				Export
			</Button>
			<Button size="sm" variant="secondary" onclick={() => (selected = [])}>Clear</Button>
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
			<Table.Root>
				<Table.HeaderRow>
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
				</Table.HeaderRow>
				<Table.Body>
					{#each orders as order (order.id)}
						<Table.Row selected={selected.includes(order.id)}>
							<Table.Cell class="px-4">
								<Checkbox
									checked={selected.includes(order.id)}
									onCheckedChange={() => toggleOne(order.id)}
									aria-label="Select {order.number}"
								/>
							</Table.Cell>
							<Table.Cell class="font-medium text-espresso">
								<a
									href={resolve('/admin/orders/[id]', { id: order.id })}
									class="hover:text-gold-dark"
								>
									{order.number}
									<span class="sr-only">— view order details</span>
								</a>
							</Table.Cell>
							<Table.Cell class="text-espresso-light">{order.customer}</Table.Cell>
							<Table.Cell><StatusBadge kind="orderType" value={order.type} /></Table.Cell>
							<Table.Cell class="text-espresso-muted">{order.items.length}</Table.Cell>
							<Table.Cell class="font-medium text-espresso">{bhd(order.total)}</Table.Cell>
							<Table.Cell><StatusBadge kind="payment" value={order.payment} /></Table.Cell>
							<Table.Cell><StatusBadge kind="orderStatus" value={order.status} /></Table.Cell>
							<Table.Cell class="text-espresso-muted">{formatDate(order.date)}</Table.Cell>
							<Table.Cell>
								<OrderRowActions {order} {oncancel} />
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>

		<!-- Mobile cards -->
		<ul class="divide-y divide-beige-border md:hidden">
			{#each orders as order (order.id)}
				<li class="flex items-start gap-3 px-4 py-4 hover:bg-cream-100">
					<div class="min-w-0 flex-1">
						<div class="flex items-center justify-between gap-3">
							<a
								href={resolve('/admin/orders/[id]', { id: order.id })}
								class="font-medium text-espresso hover:text-gold-dark"
							>
								{order.number}
							</a>
							<span class="font-medium text-espresso">{bhd(order.total)}</span>
						</div>
						<p class="mt-1 text-sm text-espresso-light">{order.customer}</p>
						<div class="mt-2 flex flex-wrap items-center gap-1.5">
							<StatusBadge kind="orderType" value={order.type} />
							<StatusBadge kind="orderStatus" value={order.status} />
							<StatusBadge kind="payment" value={order.payment} />
						</div>
						<p class="mt-2 text-xs text-espresso-muted">
							{formatDate(order.date)} · {order.items.length} items
						</p>
					</div>
					<OrderRowActions {order} {oncancel} />
				</li>
			{/each}
		</ul>
	{/if}
</Card>
