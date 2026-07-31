<script lang="ts">
	import type { NewOrderValues } from '$lib/schemas';
	import type { SuperForm } from 'sveltekit-superforms';
	import ChoiceCards from '$lib/components/shared/ChoiceCards.svelte';
	import Field from '$lib/components/shared/Field.svelte';
	import { Input } from '$lib/components/ui/input';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import { untrack } from 'svelte';

	type Props = {
		form: SuperForm<NewOrderValues>;
	};

	let { form }: Props = $props();

	const { form: values, errors } = untrack(() => form);

	const discountOptions = [
		{ value: 'none', label: 'No discount' },
		{ value: 'fixed', label: 'Fixed amount' },
		{ value: 'percentage', label: 'Percentage' }
	];

	let moreOpen = $state(false);
	let isPickup = $derived($values.deliveryMethod === 'pickup');
</script>

<div class="border-border space-y-4 border-t p-5">
	<h3 class="text-foreground font-serif text-base font-semibold">Discount and Delivery Fee</h3>

	<div>
		<p class="text-foreground mb-1.5 text-sm font-medium">Discount</p>
		<ChoiceCards
			name="discount-kind"
			legend="Discount"
			options={discountOptions}
			bind:value={$values.discountKind}
			onchange={(kind) => {
				if (kind === 'none') $values.discountValue = 0;
			}}
		/>
	</div>

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
		{#if $values.discountKind !== 'none'}
			<Field
				id="discount-value"
				label={$values.discountKind === 'percentage'
					? 'Discount percentage (%)'
					: 'Discount amount (BHD)'}
				errors={$errors.discountValue}
			>
				{#snippet control(props)}
					<Input
						{...props}
						type="number"
						step={$values.discountKind === 'percentage' ? '1' : '0.001'}
						min="0"
						max={$values.discountKind === 'percentage' ? '100' : undefined}
						bind:value={$values.discountValue}
						placeholder={$values.discountKind === 'percentage' ? '10' : '0.000'}
					/>
				{/snippet}
			</Field>
		{/if}

		{#if !isPickup}
			<Field id="delivery-fee" label="Delivery fee (BHD)" errors={$errors.deliveryFee}>
				{#snippet control(props)}
					<Input
						{...props}
						type="number"
						step="0.001"
						min="0"
						bind:value={$values.deliveryFee}
						placeholder="0.000"
					/>
				{/snippet}
			</Field>
		{/if}
	</div>

	<div class="border-border border-t pt-3">
		<button
			type="button"
			class="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm font-medium"
			aria-expanded={moreOpen}
			aria-controls="more-pricing-options"
			onclick={() => (moreOpen = !moreOpen)}
		>
			<ChevronDownIcon
				class="h-4 w-4 transition-transform {moreOpen ? 'rotate-180' : ''}"
				aria-hidden="true"
			/>
			More Options
		</button>

		{#if moreOpen}
			<div id="more-pricing-options" class="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
				<Field
					id="price-adjustment"
					label="Price adjustment (BHD)"
					hint="Use a minus sign to reduce the total"
					errors={$errors.adjustment}
				>
					{#snippet control(props)}
						<Input
							{...props}
							type="number"
							step="0.001"
							bind:value={$values.adjustment}
							placeholder="0.000"
						/>
					{/snippet}
				</Field>

				<Field
					id="adjustment-reason"
					label="Reason for the adjustment"
					errors={$errors.adjustmentReason}
				>
					{#snippet control(props)}
						<Input
							{...props}
							bind:value={$values.adjustmentReason}
							placeholder="e.g. Gift wrapping"
						/>
					{/snippet}
				</Field>
			</div>
		{/if}
	</div>
</div>
