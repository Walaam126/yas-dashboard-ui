<script lang="ts">
	import type { NewOrderValues } from '$lib/schemas';
	import type { ChosenCustomer } from '$lib/utils';
	import type { SuperForm } from 'sveltekit-superforms';
	import ChoiceCards from '$lib/components/shared/ChoiceCards.svelte';
	import Field from '$lib/components/shared/Field.svelte';
	import SelectField from '$lib/components/shared/SelectField.svelte';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { TIME_SLOT_VALUES } from '$lib/schemas';
	import { timeSlotMap } from '$lib/utils';
	import StoreIcon from '@lucide/svelte/icons/store';
	import { untrack } from 'svelte';

	type Props = {
		form: SuperForm<NewOrderValues>;
		selected: ChosenCustomer | null;
		/** Lets the page keep the delivery fee in step with the method. */
		onmethodchange: (method: string) => void;
	};

	let { form, selected, onmethodchange }: Props = $props();

	const { form: values, errors } = untrack(() => form);

	const methodOptions = [
		{ value: 'same_day', label: 'Same-day Delivery', description: 'Delivered today' },
		{ value: 'delivery', label: 'Standard Delivery', description: 'Delivered in 1–3 days' },
		{ value: 'pickup', label: 'Customer Pickup', description: 'Collected from the store' }
	];

	const slotOptions = TIME_SLOT_VALUES.map((slot) => ({ value: slot, label: timeSlotMap[slot] }));

	let isPickup = $derived($values.deliveryMethod === 'pickup');
</script>

<div class="space-y-4 p-5">
	<h3 class="text-foreground font-serif text-base font-semibold">Delivery</h3>

	<div>
		<p class="text-foreground mb-1.5 text-sm font-medium">Delivery method</p>
		<ChoiceCards
			name="delivery-method"
			legend="Delivery method"
			options={methodOptions}
			bind:value={$values.deliveryMethod}
			onchange={onmethodchange}
		/>
	</div>

	{#if isPickup}
		<p
			class="border-border bg-background text-espresso-light flex items-center gap-2.5 rounded-lg border p-4 text-sm"
		>
			<StoreIcon class="text-muted-foreground h-4 w-4 shrink-0" aria-hidden="true" />
			The customer will collect the order from the store.
		</p>
	{:else}
		<div class="border-border bg-background space-y-3 rounded-lg border p-4">
			<div>
				<p class="text-muted-foreground text-xs font-medium">Delivery address</p>
				<p class="text-foreground mt-0.5 text-sm">
					{selected?.address || 'Choose a customer to use their saved address.'}
				</p>
			</div>

			<div class="flex items-center gap-2.5">
				<Checkbox
					id="different-address"
					bind:checked={$values.useDifferentAddress}
					aria-label="Use a different delivery address"
				/>
				<Label for="different-address" class="text-sm font-normal">
					Use a different delivery address
				</Label>
			</div>

			{#if $values.useDifferentAddress}
				<Field id="delivery-address" label="Delivery address" errors={$errors.differentAddress}>
					{#snippet control(props)}
						<Textarea
							{...props}
							rows={2}
							bind:value={$values.differentAddress}
							placeholder="Building, road, block and area"
						/>
					{/snippet}
				</Field>
			{/if}
		</div>

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<Field id="delivery-date" label="Requested delivery date" errors={$errors.deliveryDate}>
				{#snippet control(props)}
					<Input {...props} type="date" bind:value={$values.deliveryDate} />
				{/snippet}
			</Field>

			<Field id="delivery-slot" label="Preferred time" errors={$errors.timeSlot}>
				{#snippet control(props)}
					<SelectField {...props} options={slotOptions} bind:value={$values.timeSlot} />
				{/snippet}
			</Field>
		</div>

		<Field
			id="delivery-instructions"
			label="Delivery instructions"
			hint="Optional — for the driver"
			errors={$errors.deliveryInstructions}
		>
			{#snippet control(props)}
				<Textarea
					{...props}
					rows={2}
					bind:value={$values.deliveryInstructions}
					placeholder="e.g. Call on arrival, gate code 1234"
				/>
			{/snippet}
		</Field>
	{/if}
</div>
