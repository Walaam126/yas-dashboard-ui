<script lang="ts">
	import type { TourFormValues } from '$lib/schemas';
	import type { SuperForm } from 'sveltekit-superforms';
	import Field from '$lib/components/shared/Field.svelte';
	import SelectField from '$lib/components/shared/SelectField.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Switch } from '$lib/components/ui/switch';
	import { Textarea } from '$lib/components/ui/textarea';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import { untrack } from 'svelte';
	import { toast } from 'svelte-sonner';

	let { form }: { form: SuperForm<TourFormValues> } = $props();

	// The SuperForm instance is stable for the lifetime of this component.
	const { form: values, errors } = untrack(() => form);
</script>

<div class="space-y-4">
	<Field id="tour-name" label="Tour name" errors={$errors.name}>
		{#snippet control(props)}
			<Input
				{...props}
				name="name"
				bind:value={$values.name}
				placeholder="e.g. Milan Summer Edit"
			/>
		{/snippet}
	</Field>

	<Field id="tour-destination" label="Destination" errors={$errors.destination}>
		{#snippet control(props)}
			<Input
				{...props}
				name="destination"
				bind:value={$values.destination}
				placeholder="e.g. Milan, Italy"
			/>
		{/snippet}
	</Field>

	<Field id="tour-description" label="Short description" errors={$errors.description}>
		{#snippet control(props)}
			<Textarea
				{...props}
				name="description"
				bind:value={$values.description}
				placeholder="What this tour offers customers…"
			/>
		{/snippet}
	</Field>

	<div>
		<span class="mb-1.5 block text-sm font-medium text-foreground">Cover image</span>
		<button
			type="button"
			onclick={() => toast('Cover upload is not available in this mockup')}
			class="flex h-28 w-full flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-gold-dark"
		>
			<PlusIcon class="h-5 w-5" aria-hidden="true" />
			<span class="text-sm">Upload cover</span>
		</button>
	</div>

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
		<Field id="tour-opening" label="Order opening" errors={$errors.openingDate}>
			{#snippet control(props)}
				<Input {...props} name="openingDate" type="date" bind:value={$values.openingDate} />
			{/snippet}
		</Field>
		<Field id="tour-deadline" label="Order deadline" errors={$errors.orderDeadline}>
			{#snippet control(props)}
				<Input {...props} name="orderDeadline" type="date" bind:value={$values.orderDeadline} />
			{/snippet}
		</Field>
		<Field id="tour-travel" label="Travel date" errors={$errors.travelDate}>
			{#snippet control(props)}
				<Input {...props} name="travelDate" type="date" bind:value={$values.travelDate} />
			{/snippet}
		</Field>
		<Field id="tour-arrival" label="Expected arrival" errors={$errors.arrivalDate}>
			{#snippet control(props)}
				<Input {...props} name="arrivalDate" type="date" bind:value={$values.arrivalDate} />
			{/snippet}
		</Field>
	</div>

	<Field id="tour-deposit" label="Required deposit (BHD)" errors={$errors.deposit}>
		{#snippet control(props)}
			<Input
				{...props}
				name="deposit"
				type="number"
				step="0.001"
				min="0"
				bind:value={$values.deposit}
				placeholder="0.000"
			/>
		{/snippet}
	</Field>

	<Field id="tour-instructions" label="Customer instructions" errors={$errors.instructions}>
		{#snippet control(props)}
			<Textarea
				{...props}
				name="instructions"
				bind:value={$values.instructions}
				placeholder="Any notes shown to customers when they request…"
			/>
		{/snippet}
	</Field>

	<Field id="tour-status" label="Status" errors={$errors.status}>
		{#snippet control(props)}
			<SelectField
				{...props}
				name="status"
				options={[
					{ value: 'draft', label: 'Draft' },
					{ value: 'open', label: 'Open for Orders' }
				]}
				bind:value={$values.status}
			/>
		{/snippet}
	</Field>

	<div
		class="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-3"
	>
		<div>
			<p class="text-sm font-medium text-foreground">Publish tour</p>
			<p class="text-xs text-muted-foreground">Make visible on the storefront.</p>
		</div>
		<Switch name="published" bind:checked={$values.published} aria-label="Publish tour" />
	</div>
</div>
