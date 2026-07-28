<script lang="ts">
	import type { TourStatusUpdateValues } from '$lib/schemas';
	import type { Order, Tour, TourStatus } from '$lib/types';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { resolve } from '$app/paths';
	import StatusBadge from '$lib/components/dashboard/StatusBadge.svelte';
	import DetailStat from '$lib/components/shared/DetailStat.svelte';
	import EmptyState from '$lib/components/shared/EmptyState.svelte';
	import Field from '$lib/components/shared/Field.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import * as NativeSelect from '$lib/components/ui/native-select';
	import * as Table from '$lib/components/ui/table';
	import { tourStatusUpdateSchema } from '$lib/schemas';
	import { bhd, formatDate, statusOptions, tourStatusMap } from '$lib/utils';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import CoinsIcon from '@lucide/svelte/icons/coins';
	import MapPinIcon from '@lucide/svelte/icons/map-pin';
	import UsersIcon from '@lucide/svelte/icons/users';
	import { untrack } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	type Props = {
		tour: Tour;
		requests: Order[];
		statusForm: SuperValidated<TourStatusUpdateValues>;
	};

	let { tour, requests, statusForm: statusFormData }: Props = $props();

	/** Locally applied status, so the mock update visibly changes the page. */
	let status = $state<TourStatus>(untrack(() => tour.status));

	const form = superForm(
		untrack(() => statusFormData),
		{
			validators: zod4Client(tourStatusUpdateSchema),
			resetForm: false,
			onUpdated: ({ form: result }) => {
				if (result.valid) {
					status = result.data.status;
					if (result.message) toast.success(result.message);
				}
			}
		}
	);
	const { form: values, enhance, errors, submitting } = form;

	const statusChoices = statusOptions(tourStatusMap);
</script>

<svelte:head>
	<title>{tour.name} — YAS Outlet Admin</title>
</svelte:head>

<a
	href={resolve('/admin/tours')}
	class="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
>
	<ArrowLeftIcon class="h-4 w-4" aria-hidden="true" />
	Back to Tours
</a>

<Card class="mb-6 overflow-hidden">
	<div class="relative h-44 sm:h-52">
		<img src={tour.image} alt="{tour.destination} tour cover" class="h-full w-full object-cover" />
		<div class="absolute inset-0 bg-foreground/35" aria-hidden="true"></div>
		<div class="absolute right-5 bottom-4 left-5">
			<StatusBadge kind="tourStatus" value={status} />
			<h1 class="mt-2 font-serif text-2xl font-semibold text-background sm:text-3xl">{tour.name}</h1>
			<p class="mt-0.5 flex items-center gap-1.5 text-sm text-background/90">
				<MapPinIcon class="h-4 w-4" aria-hidden="true" />
				{tour.destination}
			</p>
		</div>
	</div>
</Card>

<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
	<div class="space-y-6 lg:col-span-2">
		<Card>
			<CardHeader><CardTitle level={2}>Tour Summary</CardTitle></CardHeader>
			<p class="px-5 pt-4 text-sm text-espresso-light">{tour.description}</p>
			<dl class="grid grid-cols-2 gap-4 p-5 sm:grid-cols-4">
				<DetailStat label="Order deadline" value={formatDate(tour.orderDeadline)} />
				<DetailStat label="Travel date" value={formatDate(tour.travelDate)} />
				<DetailStat label="Expected arrival" value={formatDate(tour.arrivalDate)} />
				<DetailStat label="Deposit / request" value={bhd(tour.deposit)} />
			</dl>
		</Card>

		<Card>
			<CardHeader><CardTitle level={2}>Customer Requests ({requests.length})</CardTitle></CardHeader>
			{#if requests.length === 0}
				<EmptyState
					icon={UsersIcon}
					title="No requests yet"
					description="Customer requests connected to this tour will appear here."
				/>
			{:else}
				<Table.Root class="min-w-[560px]">
					<Table.Header>
					<Table.Row class="hover:bg-transparent">
						<Table.Head class="px-5">Order</Table.Head>
						<Table.Head>Customer</Table.Head>
						<Table.Head>Deposit</Table.Head>
						<Table.Head>Payment</Table.Head>
						<Table.Head>Type</Table.Head>
					</Table.Row>
				</Table.Header>
					<Table.Body>
						{#each requests as order (order.id)}
							<Table.Row>
								<Table.Cell class="px-5 font-medium text-foreground">
									<a
										href={resolve('/admin/orders/[id]', { id: order.id })}
										class="hover:text-gold-dark"
									>
										{order.number}
										<span class="sr-only">— view order details</span>
									</a>
								</Table.Cell>
								<Table.Cell class="text-espresso-light">{order.customer}</Table.Cell>
								<Table.Cell>{bhd(order.deposit ?? 0)}</Table.Cell>
								<Table.Cell><StatusBadge kind="payment" value={order.payment} /></Table.Cell>
								<Table.Cell><StatusBadge kind="orderType" value={order.type} /></Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			{/if}
		</Card>
	</div>

	<div class="space-y-6">
		<div class="grid grid-cols-2 gap-4">
			<div class="bg-card rounded-xl border p-4 shadow-sm">
				<div
					class="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-soft text-gold-dark"
				>
					<UsersIcon class="h-[18px] w-[18px]" aria-hidden="true" />
				</div>
				<p class="mt-3 font-serif text-2xl font-semibold text-foreground">{tour.requests}</p>
				<p class="text-xs text-muted-foreground">Requests</p>
			</div>
			<div class="bg-card rounded-xl border p-4 shadow-sm">
				<div
					class="flex h-9 w-9 items-center justify-center rounded-lg bg-success-soft text-success"
				>
					<CoinsIcon class="h-[18px] w-[18px]" aria-hidden="true" />
				</div>
				<p class="mt-3 font-serif text-2xl font-semibold text-foreground">{bhd(tour.deposits)}</p>
				<p class="text-xs text-muted-foreground">Deposits collected</p>
			</div>
		</div>

		<Card>
			<CardHeader><CardTitle level={2}>Update Status</CardTitle></CardHeader>
			<CardContent>
				<form method="POST" action="?/updateStatus" use:enhance>
					<Field id="tour-status-update" label="Tour status" errors={$errors.status}>
						{#snippet control(props)}
							<NativeSelect.Root {...props} name="status" bind:value={$values.status}>
								{#each statusChoices as choice (choice.value)}
									<NativeSelect.Option value={choice.value}>{choice.label}</NativeSelect.Option>
								{/each}
							</NativeSelect.Root>
						{/snippet}
					</Field>
					<Button type="submit" class="mt-3 w-full" disabled={$submitting}>
						{$submitting ? 'Updating…' : 'Update Status'}
					</Button>
				</form>
				<Button
					variant="outline"
					class="mt-2 w-full"
					onclick={() => toast('Editing tour details is not available in this mockup')}
				>
					Edit Tour Details
				</Button>
			</CardContent>
		</Card>
	</div>
</div>
