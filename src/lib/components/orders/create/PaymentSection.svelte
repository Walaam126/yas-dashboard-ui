<script lang="ts">
	import type { NewOrderValues } from '$lib/schemas';
	import type { SuperForm } from 'sveltekit-superforms';
	import ChoiceCards from '$lib/components/shared/ChoiceCards.svelte';
	import Field from '$lib/components/shared/Field.svelte';
	import { Input } from '$lib/components/ui/input';
	import { PAYMENT_METHOD_VALUES } from '$lib/schemas';
	import { bhd, paymentMethodMap } from '$lib/utils';
	import InfoIcon from '@lucide/svelte/icons/info';
	import { untrack } from 'svelte';

	type Props = {
		form: SuperForm<NewOrderValues>;
		/** Order total, so the remaining balance can be worked out. */
		total: number;
	};

	let { form, total }: Props = $props();

	const { form: values, errors } = untrack(() => form);

	const statusOptions = [
		{ value: 'unpaid', label: 'Unpaid', description: 'The customer will pay later' },
		{ value: 'paid', label: 'Paid', description: 'Payment received in full' },
		{ value: 'partial', label: 'Partially Paid', description: 'A deposit has been paid' }
	];

	const methodOptions = PAYMENT_METHOD_VALUES.map((method) => ({
		value: method,
		label: paymentMethodMap[method]
	}));

	let remaining = $derived(Math.max(total - ($values.amountPaid || 0), 0));
</script>

<div class="border-border space-y-4 border-t p-5">
	<h3 class="text-foreground font-serif text-base font-semibold">Payment</h3>

	<div>
		<p class="text-foreground mb-1.5 text-sm font-medium">Payment status</p>
		<ChoiceCards
			name="payment-status"
			legend="Payment status"
			options={statusOptions}
			bind:value={$values.paymentStatus}
		/>
	</div>

	<div>
		<p class="text-foreground mb-1.5 text-sm font-medium">Payment method</p>
		<ChoiceCards
			name="payment-method"
			legend="Payment method"
			class="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
			options={methodOptions}
			bind:value={$values.paymentMethod}
		/>
		{#if $errors.paymentMethod}
			<p class="text-danger mt-1 text-xs font-medium">{$errors.paymentMethod}</p>
		{/if}
	</div>

	{#if $values.paymentStatus === 'partial'}
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<Field id="amount-paid" label="Amount paid (BHD)" errors={$errors.amountPaid}>
				{#snippet control(props)}
					<Input
						{...props}
						type="number"
						step="0.001"
						min="0"
						bind:value={$values.amountPaid}
						placeholder="0.000"
					/>
				{/snippet}
			</Field>

			<div>
				<p class="text-foreground mb-1.5 text-sm font-medium">Remaining amount</p>
				<p
					class="border-border bg-muted text-foreground flex h-9 items-center rounded-md border px-2.5 text-sm font-medium"
					aria-live="polite"
				>
					{bhd(remaining)}
				</p>
			</div>
		</div>
	{/if}

	{#if $values.paymentMethod === 'link'}
		<p
			class="border-border bg-background text-espresso-light flex items-center gap-2.5 rounded-lg border p-4 text-sm"
		>
			<InfoIcon class="text-muted-foreground h-4 w-4 shrink-0" aria-hidden="true" />
			The payment link will be sent after the order is created.
		</p>
	{/if}
</div>
