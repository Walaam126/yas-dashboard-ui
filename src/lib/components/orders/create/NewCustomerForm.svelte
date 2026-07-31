<script lang="ts">
	import type { NewOrderValues } from '$lib/schemas';
	import type { SuperForm } from 'sveltekit-superforms';
	import Field from '$lib/components/shared/Field.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { untrack } from 'svelte';

	type Props = {
		form: SuperForm<NewOrderValues>;
		/** Called once the details are complete enough to use. */
		onsaved: () => void;
		oncancel: () => void;
	};

	let { form, onsaved, oncancel }: Props = $props();

	// The SuperForm instance is stable for the lifetime of this component.
	const { form: values, errors, validate } = untrack(() => form);

	/**
	 * Only the new-customer fields are checked here, so the rest of the order
	 * sheet stays free of errors while the administrator is still on step one.
	 */
	const REQUIRED = [
		'newCustomer.name',
		'newCustomer.phone',
		'newCustomer.email',
		'newCustomer.area',
		'newCustomer.block',
		'newCustomer.road',
		'newCustomer.building'
	] as const;

	async function save() {
		const results = await Promise.all(
			REQUIRED.map((path) => validate(path, { update: true, taint: false }))
		);
		if (results.every((issues) => !issues?.length)) onsaved();
	}
</script>

<div class="border-border bg-background space-y-4 rounded-lg border p-4">
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
		<Field
			id="new-customer-name"
			label="Full name"
			errors={$errors.newCustomer?.name}
			class="sm:col-span-2"
		>
			{#snippet control(props)}
				<Input {...props} bind:value={$values.newCustomer.name} placeholder="e.g. Noor Abdulla" />
			{/snippet}
		</Field>

		<Field id="new-customer-phone" label="Phone number" errors={$errors.newCustomer?.phone}>
			{#snippet control(props)}
				<div class="flex">
					<span
						class="border-input bg-muted text-muted-foreground inline-flex h-9 shrink-0 items-center rounded-l-md border border-r-0 px-2.5 text-sm"
					>
						+973
					</span>
					<Input
						{...props}
						type="tel"
						inputmode="numeric"
						maxlength={8}
						class="rounded-l-none"
						bind:value={$values.newCustomer.phone}
						placeholder="3311 2244"
					/>
				</div>
			{/snippet}
		</Field>

		<Field
			id="new-customer-email"
			label="Email address"
			hint="Optional"
			errors={$errors.newCustomer?.email}
		>
			{#snippet control(props)}
				<Input
					{...props}
					type="email"
					bind:value={$values.newCustomer.email}
					placeholder="name@example.bh"
				/>
			{/snippet}
		</Field>
	</div>

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
		<Field id="new-customer-area" label="Area" errors={$errors.newCustomer?.area}>
			{#snippet control(props)}
				<Input {...props} bind:value={$values.newCustomer.area} placeholder="e.g. Seef" />
			{/snippet}
		</Field>

		<Field id="new-customer-block" label="Block" errors={$errors.newCustomer?.block}>
			{#snippet control(props)}
				<Input {...props} bind:value={$values.newCustomer.block} placeholder="e.g. 428" />
			{/snippet}
		</Field>

		<Field id="new-customer-road" label="Road" errors={$errors.newCustomer?.road}>
			{#snippet control(props)}
				<Input {...props} bind:value={$values.newCustomer.road} placeholder="e.g. 2810" />
			{/snippet}
		</Field>

		<Field
			id="new-customer-building"
			label="Building, villa or flat"
			errors={$errors.newCustomer?.building}
		>
			{#snippet control(props)}
				<Input {...props} bind:value={$values.newCustomer.building} placeholder="e.g. Villa 21" />
			{/snippet}
		</Field>

		<Field
			id="new-customer-extra"
			label="Additional address details"
			hint="Optional — landmark, floor or gate"
			errors={$errors.newCustomer?.extra}
			class="sm:col-span-2"
		>
			{#snippet control(props)}
				<Input
					{...props}
					bind:value={$values.newCustomer.extra}
					placeholder="e.g. Next to the pharmacy"
				/>
			{/snippet}
		</Field>
	</div>

	<div class="flex flex-col gap-2 sm:flex-row">
		<Button variant="secondary" onclick={save}>Use This Customer</Button>
		<Button variant="ghost" onclick={oncancel}>Cancel</Button>
	</div>
</div>
