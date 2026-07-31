<script lang="ts">
	import type { NewOrderValues } from '$lib/schemas';
	import type { SuperForm } from 'sveltekit-superforms';
	import Field from '$lib/components/shared/Field.svelte';
	import { Card, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Textarea } from '$lib/components/ui/textarea';
	import { untrack } from 'svelte';

	type Props = {
		form: SuperForm<NewOrderValues>;
	};

	let { form }: Props = $props();

	const { form: values, errors } = untrack(() => form);
</script>

<Card>
	<CardHeader><CardTitle level={2}>Notes</CardTitle></CardHeader>
	<div class="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
		<Field
			id="customer-note"
			label="Customer Note"
			hint="This note may be included with the order."
			errors={$errors.customerNote}
		>
			{#snippet control(props)}
				<Textarea
					{...props}
					rows={3}
					bind:value={$values.customerNote}
					placeholder="e.g. Please gift wrap the tote."
				/>
			{/snippet}
		</Field>

		<Field
			id="team-note"
			label="Private Note for the Team"
			hint="The customer will not see this note."
			errors={$errors.teamNote}
		>
			{#snippet control(props)}
				<Textarea
					{...props}
					rows={3}
					bind:value={$values.teamNote}
					placeholder="e.g. Confirm the size with the supplier first."
				/>
			{/snippet}
		</Field>
	</div>
</Card>
