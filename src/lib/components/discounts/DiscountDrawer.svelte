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

<Sheet.Content class="bg-background gap-0 data-[side=right]:sm:max-w-xl">
	<Sheet.Header class="bg-card shrink-0 border-b px-5 py-4">
		<Sheet.Title class="truncate font-serif text-xl font-semibold">{title}</Sheet.Title>
		<Sheet.Description class="text-xs">Discount details and validity window.</Sheet.Description>
	</Sheet.Header>

	<div class="flex-1 overflow-y-auto overscroll-contain p-5">
		<form id="discount-form" method="POST" action="?/save" use:enhance>
			<DiscountFormFields {form} />
		</form>
	</div>

	<Sheet.Footer class="bg-card shrink-0 flex-row justify-end gap-3 border-t px-5 py-4">
		<Button variant="outline" onclick={oncancel}>Cancel</Button>
		<Button type="submit" form="discount-form" disabled={$submitting}>
			{$submitting ? 'Saving…' : 'Save Discount'}
		</Button>
	</Sheet.Footer>
</Sheet.Content>
