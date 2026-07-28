<script lang="ts">
	import SalesChart from '$lib/components/dashboard/SalesChart.svelte';
	import StatusBadge from '$lib/components/dashboard/StatusBadge.svelte';
	import SummaryCard from '$lib/components/dashboard/SummaryCard.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader } from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { bhd, cn, countdownLabel, formatDate } from '$lib/utils';
	import type { LucideIcon } from '@lucide/svelte';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import CalendarClockIcon from '@lucide/svelte/icons/calendar-clock';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import CoinsIcon from '@lucide/svelte/icons/coins';
	import MapPinIcon from '@lucide/svelte/icons/map-pin';
	import PackageIcon from '@lucide/svelte/icons/package';
	import ShoppingBagIcon from '@lucide/svelte/icons/shopping-bag';
	import UsersIcon from '@lucide/svelte/icons/users';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	type AttentionTone = 'gold' | 'amber' | 'red';

	const attentionTone: Record<AttentionTone, string> = {
		gold: 'bg-gold-soft text-gold-dark',
		amber: 'bg-warning-soft text-warning',
		red: 'bg-danger-soft text-danger'
	};

	interface AttentionItem {
		icon: LucideIcon;
		text: string;
		href: string;
		tone: AttentionTone;
	}

	// Every figure comes from the loaded summary, so each row matches the list it opens.
	let attention = $derived.by<AttentionItem[]>(() => {
		const items: AttentionItem[] = [
			{
				icon: ShoppingBagIcon,
				text: `${data.summary.newOrders} new orders need confirmation`,
				href: '/admin/orders?status=new',
				tone: 'gold'
			},
			{
				icon: ClockIcon,
				text: `${data.summary.preordersAwaitingSupplier} pre-orders awaiting supplier updates`,
				href: '/admin/orders?type=preorder',
				tone: 'amber'
			},
			{
				icon: PackageIcon,
				text: `${data.summary.lowStock} products are low in stock`,
				href: '/admin/products?stock=low_stock',
				tone: 'red'
			}
		];

		if (data.upcomingTour) {
			items.push({
				icon: CalendarClockIcon,
				text: `${data.upcomingTour.name} closes in ${countdownLabel(
					data.upcomingTour.orderDeadline
				).toLowerCase()}`,
				href: `/admin/tours/${data.upcomingTour.id}`,
				tone: 'gold'
			});
		}

		return items;
	});

	let salesDelta = $derived(data.summary.salesDeltaPercent);
</script>

<svelte:head>
	<title>Overview — YAS Outlet Admin</title>
</svelte:head>

<PageHeader title="Overview" description="A calm snapshot of what needs your attention today.">
	{#snippet actions()}
		<Button href="/admin/orders">
			<ShoppingBagIcon class="h-4 w-4" aria-hidden="true" />
			View Orders
		</Button>
	{/snippet}
</PageHeader>

<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
	<SummaryCard
		label="Today's Sales"
		value={bhd(data.summary.todaySales)}
		icon={CoinsIcon}
		context="{salesDelta >= 0 ? '+' : ''}{salesDelta}% vs yesterday"
		trend={salesDelta >= 0 ? 'up' : 'down'}
		tone="green"
	/>
	<SummaryCard
		label="New Orders"
		value={String(data.summary.newOrders)}
		icon={ShoppingBagIcon}
		context="Since this morning"
		tone="gold"
	/>
	<SummaryCard
		label="Waiting for Action"
		value={String(data.summary.awaitingAction)}
		icon={ClockIcon}
		context="Confirm or update status"
		tone="amber"
	/>
	<SummaryCard
		label="Low Stock Products"
		value={String(data.summary.lowStock)}
		icon={PackageIcon}
		context="Restock recommended"
		tone="red"
	/>
</div>

<div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
	<div class="space-y-6 lg:col-span-2">
		<Card>
			<CardHeader title="Recent Orders">
				{#snippet action()}
					<a
						href="/admin/orders"
						class="inline-flex items-center gap-1 text-sm font-medium text-gold-dark hover:text-gold"
					>
						View all
						<ArrowRightIcon class="h-3.5 w-3.5" aria-hidden="true" />
					</a>
				{/snippet}
			</CardHeader>

			<Table.Root minWidthClass="min-w-[640px]">
				<Table.HeaderRow>
					<Table.Head class="px-5">Order</Table.Head>
					<Table.Head>Customer</Table.Head>
					<Table.Head>Type</Table.Head>
					<Table.Head>Total</Table.Head>
					<Table.Head>Status</Table.Head>
				</Table.HeaderRow>
				<Table.Body>
					{#each data.recentOrders as order (order.id)}
						<Table.Row>
							<Table.Cell class="px-5 font-medium text-espresso">
								<a href="/admin/orders/{order.id}" class="hover:text-gold-dark">
									{order.number}
									<span class="sr-only">— view order details</span>
								</a>
							</Table.Cell>
							<Table.Cell class="text-espresso-light">{order.customer}</Table.Cell>
							<Table.Cell><StatusBadge kind="orderType" value={order.type} /></Table.Cell>
							<Table.Cell class="font-medium text-espresso">{bhd(order.total)}</Table.Cell>
							<Table.Cell><StatusBadge kind="orderStatus" value={order.status} /></Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</Card>

		<Card>
			<CardHeader title="Sales — Last 7 Days" />
			<CardContent>
				<SalesChart data={data.sales} />
			</CardContent>
		</Card>
	</div>

	<div class="space-y-6">
		<Card>
			<CardHeader title="Attention Required" />
			<ul class="divide-y divide-beige-border">
				{#each attention as item (item.text)}
					<li>
						<a
							href={item.href}
							class="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-cream-100"
						>
							<span
								class={cn(
									'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
									attentionTone[item.tone]
								)}
							>
								<item.icon class="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
							</span>
							<span class="flex-1 text-sm text-espresso">{item.text}</span>
							<ArrowRightIcon class="h-4 w-4 shrink-0 text-espresso-muted" aria-hidden="true" />
						</a>
					</li>
				{/each}
			</ul>
		</Card>

		{#if data.upcomingTour}
			{@const tour = data.upcomingTour}
			<Card class="overflow-hidden">
				<div class="relative h-28">
					<img
						src={tour.image}
						alt="{tour.destination} tour cover"
						class="h-full w-full object-cover"
						loading="lazy"
					/>
					<div class="absolute inset-0 bg-espresso/25" aria-hidden="true"></div>
					<div class="absolute right-4 bottom-3 left-4">
						<StatusBadge kind="tourStatus" value={tour.status} />
					</div>
				</div>
				<CardContent>
					<h2 class="font-serif text-lg font-semibold text-espresso">{tour.name}</h2>
					<p class="mt-0.5 flex items-center gap-1.5 text-sm text-espresso-muted">
						<MapPinIcon class="h-3.5 w-3.5" aria-hidden="true" />
						{tour.destination}
					</p>
					<dl class="mt-4 grid grid-cols-2 gap-3 text-sm">
						<div>
							<dt class="text-xs text-espresso-muted">Order deadline</dt>
							<dd class="font-medium text-espresso">{formatDate(tour.orderDeadline)}</dd>
						</div>
						<div>
							<dt class="text-xs text-espresso-muted">Tour date</dt>
							<dd class="font-medium text-espresso">{formatDate(tour.travelDate)}</dd>
						</div>
						<div>
							<dt class="text-xs text-espresso-muted">Requests</dt>
							<dd class="flex items-center gap-1 font-medium text-espresso">
								<UsersIcon class="h-3.5 w-3.5 text-gold" aria-hidden="true" />
								{tour.requests} submitted
							</dd>
						</div>
						<div>
							<dt class="text-xs text-espresso-muted">Closes in</dt>
							<dd class="font-medium text-espresso">{countdownLabel(tour.orderDeadline)}</dd>
						</div>
					</dl>
					<Button variant="secondary" href="/admin/tours/{tour.id}" class="mt-4 w-full">
						Manage Tour
					</Button>
				</CardContent>
			</Card>
		{/if}
	</div>
</div>
