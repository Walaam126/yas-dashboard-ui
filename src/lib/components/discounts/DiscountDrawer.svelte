<script lang="ts">
	import type { DiscountFormValues } from '$lib/schemas';
	import type { SuperValidated } from 'sveltekit-superforms';
	import DiscountFormFields from '$lib/components/discounts/DiscountFormFields.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';
	import { discountSchema } from '$lib/schemas';
	import { untrack } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	type Props = {
		data: SuperValidated<DiscountFormValues>;
		title: string;
		onsaved: () => void;
		oncancel: () => void;
	};

	let { data, title, onsaved, oncancel }: Props = $props();

	const form = superForm(
		untrack(() => data),
		{
			validators: zod4Client(discountSchema),
			dataType: 'json',
			resetForm: false,
			onUpdated: ({ form: result }) => {
				if (result.valid && result.message) {
					toast.success(result.message);
					onsaved();
				}
			}
		}
	);
	const { enhance, submitting } = form;
</script>

<Sheet.Content {title} description="Discount details and validity window.">
	<form id="discount-form" method="POST" action="?/save" use:enhance>
		<DiscountFormFields {form} />
	</form>
	{#snippet footer()}
		<div class="flex justify-end gap-3">
			<Button variant="secondary" onclick={oncancel}>Cancel</Button>
			<Button type="submit" form="discount-form" disabled={$submitting}>
				{$submitting ? 'Saving…' : 'Save Discount'}
			</Button>
		</div>
	{/snippet}
</Sheet.Content>
