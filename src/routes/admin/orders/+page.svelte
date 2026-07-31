<script lang="ts">
	import type { FilterConfig } from '$lib/components/dashboard/FilterControls.svelte';
	import type { Order } from '$lib/types';
	import type { PageData } from './$types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import FilterBar from '$lib/components/dashboard/FilterBar.svelte';
	import TabCounters from '$lib/components/dashboard/TabCounters.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import OrdersList from '$lib/components/orders/OrdersList.svelte';
	import ConfirmAction from '$lib/components/shared/ConfirmAction.svelte';
	import TableSkeleton from '$lib/components/shared/TableSkeleton.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';
	import { ORDER_FILTER_KEYS, orderTabs } from '$lib/data/order-filters';
	import { activeFilterCount, applyParams, withParams } from '$lib/utils';
	import DownloadIcon from '@lucide/svelte/icons/download';
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
		<Button variant="outline" onclick={() => toast.success('Orders exported to CSV')}>
			<DownloadIcon class="h-4 w-4" aria-hidden="true" />
			Export
		</Button>
		<Button href={resolve('/admin/orders/new')}>
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

{#await data.results}
	<Card><TableSkeleton rows={6} cols={6} /></Card>
{:then orders}
	<OrdersList {orders} oncancel={requestCancel} />
{/await}

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
