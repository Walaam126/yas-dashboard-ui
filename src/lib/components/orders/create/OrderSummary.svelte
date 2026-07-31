<script lang="ts">
	import type { NewOrderValues } from '$lib/schemas';
	import type { ChosenCustomer, OrderTotals } from '$lib/utils';
	import DetailRow from '$lib/components/shared/DetailRow.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { bhd, deliveryChoiceMap, orderTypeMap, paymentMap, paymentMethodMap } from '$lib/utils';
	import InfoIcon from '@lucide/svelte/icons/info';

	type Props = {
		values: NewOrderValues;
		totals: OrderTotals;
		customer: ChosenCustomer | null;
		tourName?: string;
		/** What is still missing; `null` once the order can be created. */
		nextStep: string | null;
		submitting: boolean;
		ondraft: () => void;
	};

	let { values, totals, customer, tourName, nextStep, submitting, ondraft }: Props = $props();

	const NOT_SELECTED = 'Not selected';

	let orderTypeLabel = $derived(
		values.orderType === 'tour' && tourName
			? `Tour — ${tourName}`
			: orderTypeMap[values.orderType].label
	);
	let paymentMethodLabel = $derived(
		values.paymentMethod ? paymentMethodMap[values.paymentMethod] : NOT_SELECTED
	);
</script>

<Card>
	<CardHeader><CardTitle level={2}>Order Summary</CardTitle></CardHeader>

	<div class="space-y-3 p-5 text-sm">
		{#if values.items.length === 0}
			<p class="text-muted-foreground">No products added yet.</p>
		{:else}
			<p class="text-muted-foreground text-xs font-medium">
				{totals.itemCount}
				{totals.itemCount === 1 ? 'item' : 'items'}
			</p>
			<ul class="space-y-2">
				{#each values.items as line (line.key)}
					<li class="flex items-start justify-between gap-3">
						<span class="text-espresso-light min-w-0">
							<span class="text-foreground font-medium">{line.qty} ×</span>
							{line.name}
						</span>
						<span class="text-foreground shrink-0 font-medium">{bhd(line.price * line.qty)}</span>
					</li>
				{/each}
			</ul>
		{/if}
	</div>

	<div class="border-border bg-background space-y-2 border-t p-5 text-sm">
		<DetailRow label="Subtotal" value={bhd(totals.subtotal)} />
		{#if totals.discount > 0}
			<DetailRow label="Discount" value="− {bhd(totals.discount)}" tone="green" />
		{/if}
		{#if values.deliveryMethod !== 'pickup'}
			<DetailRow label="Delivery fee" value={bhd(totals.deliveryFee)} />
		{/if}
		{#if totals.adjustment !== 0}
			<DetailRow
				label={values.adjustmentReason || 'Price adjustment'}
				value="{totals.adjustment > 0 ? '+' : '−'} {bhd(Math.abs(totals.adjustment))}"
			/>
		{/if}
		<div
			class="border-border text-foreground flex items-center justify-between border-t pt-2 text-base font-semibold"
		>
			<span>Total</span>
			<span>{bhd(totals.total)}</span>
		</div>
	</div>

	<div class="border-border space-y-2 border-t p-5 text-sm">
		<DetailRow label="Customer" value={customer?.name ?? NOT_SELECTED} />
		<DetailRow label="Order type" value={orderTypeLabel} />
		<DetailRow label="Delivery" value={deliveryChoiceMap[values.deliveryMethod]} />
		<DetailRow label="Payment status" value={paymentMap[values.paymentStatus].label} />
		<DetailRow label="Payment method" value={paymentMethodLabel} />
	</div>

	<div class="border-border space-y-2 border-t p-5">
		{#if nextStep}
			<p
				class="text-espresso-light bg-muted mb-3 flex items-start gap-2 rounded-lg px-3 py-2.5 text-xs"
			>
				<InfoIcon class="text-muted-foreground mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
				<span>{nextStep}</span>
			</p>
		{/if}

		<Button type="submit" class="h-11 w-full text-base" disabled={Boolean(nextStep) || submitting}>
			{submitting ? 'Creating…' : 'Create Order'}
		</Button>
		<Button variant="outline" class="w-full" disabled={submitting} onclick={ondraft}>
			Save as Draft
		</Button>
	</div>
</Card>
