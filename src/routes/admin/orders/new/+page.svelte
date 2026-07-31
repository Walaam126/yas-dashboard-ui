<script lang="ts">
	import type { PageData } from './$types';
	import { resolve } from '$app/paths';
	import CustomerSection from '$lib/components/orders/create/CustomerSection.svelte';
	import DeliverySection from '$lib/components/orders/create/DeliverySection.svelte';
	import OrderNotes from '$lib/components/orders/create/OrderNotes.svelte';
	import OrderSummary from '$lib/components/orders/create/OrderSummary.svelte';
	import PaymentSection from '$lib/components/orders/create/PaymentSection.svelte';
	import PricingOptions from '$lib/components/orders/create/PricingOptions.svelte';
	import ProductsSection from '$lib/components/orders/create/ProductsSection.svelte';
	import SectionCard from '$lib/components/orders/create/SectionCard.svelte';
	import { newOrderSchema } from '$lib/schemas';
	import { chosenCustomer, DEFAULT_DELIVERY_FEE, nextStepMessage, orderTotals } from '$lib/utils';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import { untrack } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	let { data }: { data: PageData } = $props();

	const form = superForm(
		untrack(() => data.form),
		{
			validators: zod4Client(newOrderSchema),
			// The order lines are a nested array, so the sheet posts as JSON.
			dataType: 'json',
			resetForm: false,
			// Leaving the page is not interrupted — no browser prompt either.
			taintedMessage: false
		}
	);
	const { form: values, enhance, submitting } = form;

	let customer = $derived(chosenCustomer($values, data.customers));
	let totals = $derived(orderTotals($values));
	let nextStep = $derived(nextStepMessage($values));
	let tourName = $derived(data.tours.find((tour) => tour.id === $values.tourId)?.name);

	function saveDraft() {
		// Mock-only: a draft is kept on the page, so the administrator can carry on.
		toast.success('Order saved as draft.');
	}

	/** A pickup needs no fee; restore the normal one when delivery comes back. */
	function syncDeliveryFee(method: string) {
		$values.deliveryFee = method === 'pickup' ? 0 : DEFAULT_DELIVERY_FEE;
	}
</script>

<svelte:head>
	<title>Create Order — YAS Outlet Admin</title>
</svelte:head>

<a
	href={resolve('/admin/orders')}
	class="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1.5 text-sm font-medium"
>
	<ArrowLeftIcon class="h-4 w-4" aria-hidden="true" />
	Back to Orders
</a>

<div class="mb-6">
	<h1 class="text-foreground font-serif text-2xl font-semibold sm:text-3xl">Create Order</h1>
	<p class="text-muted-foreground mt-1 text-sm">Create a manual order for a customer.</p>
</div>

<form method="POST" use:enhance>
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
		<div class="space-y-6 lg:col-span-2">
			<SectionCard
				step={1}
				title="Choose a Customer"
				description="Search for an existing customer or add a new one."
			>
				<CustomerSection
					{form}
					customers={data.customers}
					selected={customer}
					onchosen={() => {
						$values.useDifferentAddress = false;
						$values.differentAddress = '';
					}}
				/>
			</SectionCard>

			<SectionCard
				step={2}
				title="Add Products"
				description="Choose the products included in this order."
			>
				<ProductsSection {form} products={data.products} tours={data.tours} />
			</SectionCard>

			<SectionCard
				step={3}
				title="Delivery and Payment"
				description="Choose how the order reaches the customer and how it is paid."
			>
				<DeliverySection {form} selected={customer} onmethodchange={syncDeliveryFee} />
				<PaymentSection {form} total={totals.total} />
				<PricingOptions {form} />
			</SectionCard>

			<OrderNotes {form} />
		</div>

		<div class="lg:col-span-1">
			<!--
				Sticky on desktop, offset from the header. The page is the only
				scroller, so a long summary is reached by scrolling as usual.
			-->
			<div class="lg:sticky lg:top-6">
				<OrderSummary
					values={$values}
					{totals}
					{customer}
					{tourName}
					{nextStep}
					submitting={$submitting}
					ondraft={saveDraft}
				/>
			</div>
		</div>
	</div>
</form>
