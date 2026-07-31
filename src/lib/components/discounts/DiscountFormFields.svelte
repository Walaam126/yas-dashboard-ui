<script lang="ts">
	import type { DiscountFormValues } from '$lib/schemas';
	import type { SuperForm } from 'sveltekit-superforms';
	import Field from '$lib/components/shared/Field.svelte';
	import SelectField from '$lib/components/shared/SelectField.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Switch } from '$lib/components/ui/switch';
	import { untrack } from 'svelte';

	let { form }: { form: SuperForm<DiscountFormValues> } = $props();

	// The SuperForm instance is stable for the lifetime of this component.
	const { form: values, errors } = untrack(() => form);

	let isScoped = $derived($values.type === 'product' || $values.type === 'category');
	let valueHint = $derived(
		$values.type === 'percentage' ? 'Percentage off, e.g. 15' : 'Amount in BHD, e.g. 5.000'
	);

	const typeOptions = [
		{ value: 'percentage', label: 'Percentage' },
		{ value: 'fixed', label: 'Fixed Amount' },
		{ value: 'product', label: 'Product-specific' },
		{ value: 'category', label: 'Category' },
		{ value: 'promo', label: 'Promo Code' }
	];

	let scopeOptions = $derived([
		{ value: 'all', label: $values.type === 'product' ? 'All products' : 'All categories' },
		{ value: 'Women', label: 'Women' },
		{ value: 'Men', label: 'Men' },
		{ value: 'Kids', label: 'Kids' }
	]);
</script>

<div class="space-y-4">
	<Field id="discount-name" label="Discount name" errors={$errors.name}>
		{#snippet control(props)}
			<Input {...props} name="name" bind:value={$values.name} placeholder="e.g. Summer Sale" />
		{/snippet}
	</Field>

	<Field
		id="discount-code"
		label="Promo code"
		hint="Capital letters and numbers"
		errors={$errors.code}
	>
		{#snippet control(props)}
			<Input {...props} name="code" bind:value={$values.code} placeholder="e.g. SUMMER15" />
		{/snippet}
	</Field>

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
		<Field id="discount-type" label="Discount type" errors={$errors.type}>
			{#snippet control(props)}
				<SelectField {...props} name="type" options={typeOptions} bind:value={$values.type} />
			{/snippet}
		</Field>

		<Field id="discount-value" label="Value" hint={valueHint} errors={$errors.value}>
			{#snippet control(props)}
				<Input
					{...props}
					name="value"
					type="number"
					step="0.001"
					min="0"
					bind:value={$values.value}
				/>
			{/snippet}
		</Field>
	</div>

	{#if isScoped}
		<Field
			id="discount-scope"
			label={$values.type === 'product' ? 'Applicable products' : 'Applicable categories'}
			errors={$errors.scope}
		>
			{#snippet control(props)}
				<SelectField {...props} name="scope" options={scopeOptions} bind:value={$values.scope} />
			{/snippet}
		</Field>
	{/if}

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
		<Field id="discount-minimum" label="Minimum order (BHD)" errors={$errors.minimumOrder}>
			{#snippet control(props)}
				<Input
					{...props}
					name="minimumOrder"
					type="number"
					step="0.001"
					min="0"
					bind:value={$values.minimumOrder}
					placeholder="0.000"
				/>
			{/snippet}
		</Field>

		<Field id="discount-limit" label="Usage limit" errors={$errors.usageLimit}>
			{#snippet control(props)}
				<Input
					{...props}
					name="usageLimit"
					type="number"
					min="1"
					bind:value={$values.usageLimit}
					placeholder="100"
				/>
			{/snippet}
		</Field>

		<Field id="discount-start" label="Start date" errors={$errors.start}>
			{#snippet control(props)}
				<Input {...props} name="start" type="date" bind:value={$values.start} />
			{/snippet}
		</Field>

		<Field id="discount-end" label="End date" errors={$errors.end}>
			{#snippet control(props)}
				<Input {...props} name="end" type="date" bind:value={$values.end} />
			{/snippet}
		</Field>
	</div>

	<div
		class="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-3"
	>
		<div>
			<p class="text-sm font-medium text-foreground">Active</p>
			<p class="text-xs text-muted-foreground">Enable this discount immediately.</p>
		</div>
		<Switch name="active" bind:checked={$values.active} aria-label="Active" />
	</div>
</div>
