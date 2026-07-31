<script lang="ts">
	import type { NewOrderValues } from '$lib/schemas';
	import type { Tour } from '$lib/types';
	import type { SuperForm } from 'sveltekit-superforms';
	import ChoiceCards from '$lib/components/shared/ChoiceCards.svelte';
	import Field from '$lib/components/shared/Field.svelte';
	import SelectField from '$lib/components/shared/SelectField.svelte';
	import { Input } from '$lib/components/ui/input';
	import { untrack } from 'svelte';

	type Props = {
		form: SuperForm<NewOrderValues>;
		tours: Tour[];
	};

	let { form, tours }: Props = $props();

	const { form: values, errors } = untrack(() => form);

	const orderTypeOptions = [
		{ value: 'ready', label: 'Ready to Ship', description: 'Available for immediate fulfilment' },
		{ value: 'preorder', label: 'Pre-order', description: 'Ordered before local availability' },
		{ value: 'tour', label: 'Tour', description: 'Sourced during a scheduled shopping tour' }
	];

	// Finished and cancelled tours can no longer take orders.
	let tourOptions = $derived(
		tours
			.filter((tour) => tour.status !== 'completed' && tour.status !== 'cancelled')
			.map((tour) => ({ value: tour.id, label: `${tour.name} — ${tour.destination}` }))
	);

	let showArrival = $derived($values.orderType !== 'ready');
</script>

<div class="space-y-4">
	<div>
		<p class="text-foreground mb-1.5 text-sm font-medium">Order type</p>
		<ChoiceCards
			name="order-type"
			legend="Order type"
			options={orderTypeOptions}
			bind:value={$values.orderType}
		/>
	</div>

	{#if showArrival}
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			{#if $values.orderType === 'tour'}
				<Field id="order-tour" label="Shopping tour" errors={$errors.tourId}>
					{#snippet control(props)}
						<SelectField
							{...props}
							options={tourOptions}
							placeholder="Choose a tour…"
							bind:value={$values.tourId}
						/>
					{/snippet}
				</Field>
			{/if}

			<Field
				id="order-expected-arrival"
				label="Estimated arrival"
				hint="Optional — tell the customer when to expect it"
				errors={$errors.expectedArrival}
			>
				{#snippet control(props)}
					<Input {...props} type="date" bind:value={$values.expectedArrival} />
				{/snippet}
			</Field>
		</div>
	{/if}
</div>
