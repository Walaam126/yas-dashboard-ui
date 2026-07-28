<script lang="ts">
	import type { NoteValues, OrderStatusUpdateValues } from '$lib/schemas';
	import type { Order, OrderStatus } from '$lib/types';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { resolve } from '$app/paths';
	import StatusBadge from '$lib/components/dashboard/StatusBadge.svelte';
	import ConfirmAction from '$lib/components/shared/ConfirmAction.svelte';
	import DetailRow from '$lib/components/shared/DetailRow.svelte';
	import DetailStat from '$lib/components/shared/DetailStat.svelte';
	import Field from '$lib/components/shared/Field.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader } from '$lib/components/ui/card';
	import { Select } from '$lib/components/ui/select';
	import { Textarea } from '$lib/components/ui/textarea';
	import { noteSchema, orderStatusUpdateSchema } from '$lib/schemas';
	import { bhd, deliveryMap, formatDate, orderStatusMap, statusOptions } from '$lib/utils';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import CheckCircleIcon from '@lucide/svelte/icons/circle-check';
	import XCircleIcon from '@lucide/svelte/icons/circle-x';
	import CreditCardIcon from '@lucide/svelte/icons/credit-card';
	import MailIcon from '@lucide/svelte/icons/mail';
	import MapPinIcon from '@lucide/svelte/icons/map-pin';
	import PhoneIcon from '@lucide/svelte/icons/phone';
	import PrinterIcon from '@lucide/svelte/icons/printer';
	import UserIcon from '@lucide/svelte/icons/user';
	import { untrack } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	type Props = {
		order: Order;
		statusForm: SuperValidated<OrderStatusUpdateValues>;
		noteForm: SuperValidated<NoteValues>;
	};

	let { order, statusForm: statusFormData, noteForm: noteFormData }: Props = $props();

	/** Locally applied status, so the mock action visibly changes the page. */
	let status = $state<OrderStatus>(untrack(() => order.status));
	let payment = $state(untrack(() => order.payment));
	let cancelOpen = $state(false);

	const statusForm = superForm(
		untrack(() => statusFormData),
		{
			validators: zod4Client(orderStatusUpdateSchema),
			resetForm: false,
			onUpdated: ({ form }) => {
				if (form.valid) {
					status = form.data.status;
					if (form.message) toast.success(form.message);
				}
			}
		}
	);
	const {
		form: statusValues,
		enhance: statusEnhance,
		submitting: statusSubmitting,
		errors: statusErrors
	} = statusForm;

	const noteForm = superForm(
		untrack(() => noteFormData),
		{
			validators: zod4Client(noteSchema),
			resetForm: false,
			onUpdated: ({ form }) => {
				if (form.valid && form.message) toast.success(form.message);
			}
		}
	);
	const {
		form: noteValues,
		enhance: noteEnhance,
		submitting: noteSubmitting,
		errors: noteErrors
	} = noteForm;

	let isSpecial = $derived(order.type !== 'ready');
	const statusChoices = statusOptions(orderStatusMap);

	const customerLinkClass =
		'flex items-center gap-2 font-medium text-espresso hover:text-gold-dark';

	// Deep-links into the customer directory with this customer's drawer open.
	let customerHref = $derived(
		`${resolve('/admin/customers')}?customer=${encodeURIComponent(order.customerId)}`
	);

	function confirmOrder() {
		status = 'confirmed';
		$statusValues.status = 'confirmed';
		toast.success('Order confirmed');
	}

	function markAsPaid() {
		payment = 'paid';
		toast.success('Marked as paid');
	}
</script>

<svelte:head>
	<title>{order.number} — YAS Outlet Admin</title>
</svelte:head>

<a
	href={resolve('/admin/orders')}
	class="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-espresso-muted hover:text-espresso"
>
	<ArrowLeftIcon class="h-4 w-4" aria-hidden="true" />
	Back to Orders
</a>

<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
	<div>
		<div class="flex flex-wrap items-center gap-3">
			<h1 class="font-serif text-2xl font-semibold text-espresso sm:text-3xl">{order.number}</h1>
			<StatusBadge kind="orderStatus" value={status} />
			<StatusBadge kind="orderType" value={order.type} />
		</div>
		<p class="mt-1 text-sm text-espresso-muted">Placed on {formatDate(order.date)}</p>
	</div>
	<div class="flex flex-wrap gap-2">
		{#if status === 'new'}
			<Button onclick={confirmOrder}>
				<CheckCircleIcon class="h-4 w-4" aria-hidden="true" />
				Confirm Order
			</Button>
		{/if}
		{#if payment !== 'paid'}
			<Button variant="secondary" onclick={markAsPaid}>
				<CreditCardIcon class="h-4 w-4" aria-hidden="true" />
				Mark as Paid
			</Button>
		{/if}
		<Button variant="secondary" onclick={() => toast('Printing order…')}>
			<PrinterIcon class="h-4 w-4" aria-hidden="true" />
			Print
		</Button>
		<Button variant="danger" onclick={() => (cancelOpen = true)}>
			<XCircleIcon class="h-4 w-4" aria-hidden="true" />
			Cancel
		</Button>
	</div>
</div>

<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
	<div class="space-y-6 lg:col-span-2">
		<Card>
			<CardHeader title="Items ({order.items.length})" />
			<ul class="divide-y divide-beige-border">
				{#each order.items as lineItem (lineItem.id)}
					<li class="flex gap-4 p-5">
						<img
							src={lineItem.image}
							alt={lineItem.name}
							class="h-16 w-16 shrink-0 rounded-lg border border-beige-border object-cover"
							loading="lazy"
						/>
						<div class="flex min-w-0 flex-1 flex-col">
							<span class="font-medium text-espresso">{lineItem.name}</span>
							<span class="text-xs text-espresso-muted">{lineItem.brand}</span>
							<div class="mt-1 flex flex-wrap gap-1.5">
								<Badge tone="neutral">Size {lineItem.size}</Badge>
								<Badge tone="neutral">{lineItem.color}</Badge>
								<Badge tone="neutral">Qty {lineItem.qty}</Badge>
							</div>
						</div>
						<span class="font-medium text-espresso">{bhd(lineItem.price * lineItem.qty)}</span>
					</li>
				{/each}
			</ul>
			<div class="space-y-2 border-t border-beige-border bg-cream-100 p-5 text-sm">
				<DetailRow label="Subtotal" value={bhd(order.subtotal)} />
				{#if order.discount > 0}
					<DetailRow label="Discount" value="− {bhd(order.discount)}" tone="green" />
				{/if}
				<DetailRow label="Delivery fee" value={bhd(order.deliveryFee)} />
				<div
					class="flex items-center justify-between border-t border-beige-border pt-2 text-base font-semibold text-espresso"
				>
					<span>Total</span>
					<span>{bhd(order.total)}</span>
				</div>
			</div>
		</Card>

		{#if isSpecial}
			<Card>
				<CardHeader title={order.type === 'tour' ? 'Tour Details' : 'Pre-order Details'} />
				<dl class="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
					{#if order.tourName}
						<DetailStat label="Tour" value={order.tourName} />
					{/if}
					{#if order.expectedDate}
						<DetailStat label="Expected arrival" value={formatDate(order.expectedDate)} />
					{/if}
					{#if order.supplierRef}
						<DetailStat label="Supplier reference" value={order.supplierRef} />
					{/if}
					{#if order.deposit != null}
						<DetailStat label="Deposit paid" value={bhd(order.deposit)} />
					{/if}
					{#if order.remaining != null}
						<DetailStat label="Remaining balance" value={bhd(order.remaining)} />
					{/if}
				</dl>
			</Card>
		{/if}

		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
			{#if order.customerNote}
				<Card>
					<CardHeader title="Customer Note" />
					<p class="p-5 text-sm text-espresso-light">{order.customerNote}</p>
				</Card>
			{/if}
			<Card class={order.customerNote ? '' : 'sm:col-span-2'}>
				<CardHeader title="Internal Admin Notes" />
				<CardContent>
					<form method="POST" action="?/saveNote" use:noteEnhance>
						<Field id="admin-note" errors={$noteErrors.note}>
							{#snippet control(props)}
								<Textarea
									{...props}
									name="note"
									bind:value={$noteValues.note}
									placeholder="Add a private note for your team…"
								/>
							{/snippet}
						</Field>
						<Button
							size="sm"
							variant="secondary"
							type="submit"
							class="mt-3"
							disabled={$noteSubmitting}
						>
							{$noteSubmitting ? 'Saving…' : 'Save Note'}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	</div>

	<div class="space-y-6">
		<Card>
			<CardHeader title="Update Status" />
			<CardContent>
				<form method="POST" action="?/updateStatus" use:statusEnhance>
					<Field id="order-status" label="Order status" errors={$statusErrors.status}>
						{#snippet control(props)}
							<Select {...props} name="status" bind:value={$statusValues.status}>
								{#each statusChoices as choice (choice.value)}
									<option value={choice.value}>{choice.label}</option>
								{/each}
							</Select>
						{/snippet}
					</Field>
					<Button type="submit" class="mt-3 w-full" disabled={$statusSubmitting}>
						{$statusSubmitting ? 'Updating…' : 'Update Status'}
					</Button>
				</form>
			</CardContent>
		</Card>

		<Card>
			<CardHeader title="Customer" />
			<div class="space-y-3 p-5 text-sm">
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- built from a resolved base path -->
				<a href={customerHref} class={customerLinkClass}>
					<UserIcon class="h-4 w-4 text-espresso-muted" aria-hidden="true" />
					{order.customer}
				</a>
				<a
					href="tel:{order.phone}"
					class="flex items-center gap-2 text-espresso-light hover:text-gold-dark"
				>
					<PhoneIcon class="h-4 w-4 text-espresso-muted" aria-hidden="true" />
					{order.phone}
				</a>
				<a
					href="mailto:{order.email}"
					class="flex items-center gap-2 text-espresso-light hover:text-gold-dark"
				>
					<MailIcon class="h-4 w-4 text-espresso-muted" aria-hidden="true" />
					{order.email}
				</a>
				<div class="flex items-start gap-2 text-espresso-light">
					<MapPinIcon class="mt-0.5 h-4 w-4 shrink-0 text-espresso-muted" aria-hidden="true" />
					<span>{order.address}</span>
				</div>
			</div>
		</Card>

		<Card>
			<CardHeader title="Payment" />
			<div class="space-y-3 p-5 text-sm">
				<DetailRow label="Status">
					<StatusBadge kind="payment" value={payment} />
				</DetailRow>
				<DetailRow label="Method" value={order.paymentMethod} />
				<DetailRow label="Delivery" value={deliveryMap[order.delivery]} />
			</div>
		</Card>

		<Card>
			<CardHeader title="Order Activity" />
			<ol class="p-5">
				{#each order.activity as entry, index (entry.label)}
					<li class="relative flex gap-3 pb-5 last:pb-0">
						{#if index < order.activity.length - 1}
							<span class="absolute top-4 left-[7px] h-full w-px bg-beige-border" aria-hidden="true"
							></span>
						{/if}
						<span
							class="mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-gold bg-surface"
							aria-hidden="true"
						></span>
						<div>
							<p class="text-sm font-medium text-espresso">{entry.label}</p>
							<p class="text-xs text-espresso-muted">{entry.date} · {entry.by}</p>
						</div>
					</li>
				{/each}
			</ol>
		</Card>
	</div>
</div>

<ConfirmAction
	bind:open={cancelOpen}
	title="Cancel this order?"
	description="This will mark the order as cancelled and notify the customer. This action cannot be undone."
	confirmLabel="Cancel Order"
	cancelLabel="Keep Order"
	onconfirm={() => {
		status = 'cancelled';
		$statusValues.status = 'cancelled';
		toast.success('Order cancelled');
	}}
/>
