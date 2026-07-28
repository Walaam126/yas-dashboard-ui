<script lang="ts">
	import type { FilterConfig } from '$lib/components/dashboard/FilterControls.svelte';
	import type { Order } from '$lib/types';
	import type { PageData } from './$types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import FilterBar from '$lib/components/dashboard/FilterBar.svelte';
	import StatusBadge from '$lib/components/dashboard/StatusBadge.svelte';
	import TabCounters from '$lib/components/dashboard/TabCounters.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import OrderRowActions from '$lib/components/orders/OrderRowActions.svelte';
	import ConfirmAction from '$lib/components/shared/ConfirmAction.svelte';
	import EmptyState from '$lib/components/shared/EmptyState.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Table from '$lib/components/ui/table';
	import { ORDER_FILTER_KEYS, orderTabs } from '$lib/data/order-filters';
	import { activeFilterCount, applyParams, bhd, formatDate, withParams } from '$lib/utils';
	import DownloadIcon from '@lucide/svelte/icons/download';
	import InboxIcon from '@lucide/svelte/icons/inbox';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import { toast } from 'svelte-sonner';

	let { data }: { data: PageData } = $props();

	const filterConfig: FilterConfig[] = [
		{
			key: 'type',
			label: 'Type',
			options: [
				{ value: 'ready', label: 'Ready to Ship' },
				{ value: 'preorder', label: 'Pre-order' },
				{ value: 'tour', label: 'Tour' }
			]
		},
		{
			key: 'payment',
			label: 'Payment',
			options: [
				{ value: 'paid', label: 'Paid' },
				{ value: 'unpaid', label: 'Unpaid' },
				{ value: 'partial', label: 'Partially Paid' },
				{ value: 'refunded', label: 'Refunded' }
			]
		},
		{
			key: 'delivery',
			label: 'Delivery',
			options: [
				{ value: 'delivery', label: 'Delivery' },
				{ value: 'pickup', label: 'Pickup' },
				{ value: 'same_day', label: 'Same-day' }
			]
		}
	];

	let selected = $state<string[]>([]);
	let orderToCancel = $state<Order | null>(null);
	let cancelOpen = $state(false);

	function requestCancel(order: Order) {
		orderToCancel = order;
		cancelOpen = true;
	}

	let tabs = $derived(
		orderTabs.map((tab) => ({
			key: tab.key,
			label: tab.label,
			count: data.tabCounts[tab.key] ?? 0,
			href: withParams(page.url, { status: tab.key === 'all' ? null : tab.key })
		}))
	);

	let filterValues = $derived({
		type: data.query.type,
		payment: data.query.payment,
		delivery: data.query.delivery
	});

	let activeFilters = $derived(activeFilterCount(page.url, ORDER_FILTER_KEYS));
	let allSelected = $derived(data.orders.length > 0 && selected.length === data.orders.length);

	// A row can disappear behind a filter change; drop it from the selection too.
	$effect(() => {
		const visible = new Set(data.orders.map((order) => order.id));
		if (selected.some((id) => !visible.has(id))) {
			selected = selected.filter((id) => visible.has(id));
		}
	});

	function toggleAll() {
		selected = allSelected ? [] : data.orders.map((order) => order.id);
	}

	function toggleOne(id: string) {
		selected = selected.includes(id)
			? selected.filter((current) => current !== id)
			: [...selected, id];
	}

	function resetFilters() {
		applyParams(page.url, { type: null, payment: null, delivery: null });
	}
</script>

<svelte:head>
	<title>Orders — YAS Outlet Admin</title>
</svelte:head>

<PageHeader
	title="Orders"
	count="{data.total} total"
	description="Manage and fulfil every order in one place."
>
	{#snippet actions()}
		<Button variant="secondary" onclick={() => toast.success('Orders exported to CSV')}>
			<DownloadIcon class="h-4 w-4" aria-hidden="true" />
			Export
		</Button>
		<Button onclick={() => toast('Create order — coming soon')}>
			<PlusIcon class="h-4 w-4" aria-hidden="true" />
			Create Order
		</Button>
	{/snippet}
</PageHeader>

<div class="mb-4">
	<TabCounters {tabs} active={data.query.tab} label="Filter orders by status" />
</div>

<FilterBar
	filters={filterConfig}
	values={filterValues}
	searchValue={data.query.search}
	searchLabel="Search orders"
	searchPlaceholder="Search order # or customer…"
	breakpoint="lg"
	activeCount={activeFilters}
	onchange={(key, value) => applyParams(page.url, { [key]: value })}
	onsearch={(value) => applyParams(page.url, { q: value })}
	onreset={resetFilters}
/>

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
	{#if data.orders.length === 0}
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
					{#each data.orders as order (order.id)}
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
								<OrderRowActions {order} oncancel={requestCancel} />
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>

		<!-- Mobile cards -->
		<ul class="divide-y divide-beige-border md:hidden">
			{#each data.orders as order (order.id)}
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
					<OrderRowActions {order} oncancel={requestCancel} />
				</li>
			{/each}
		</ul>
	{/if}
</Card>

<ConfirmAction
	bind:open={cancelOpen}
	title="Cancel this order?"
	description="This will mark the order as cancelled and notify the customer. This action cannot be undone."
	confirmLabel="Cancel Order"
	cancelLabel="Keep Order"
	onconfirm={() => {
		toast.success(`${orderToCancel?.number} cancelled`);
		orderToCancel = null;
	}}
/>
