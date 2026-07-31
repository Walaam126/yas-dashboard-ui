<script lang="ts">
	import type { NewOrderValues } from '$lib/schemas';
	import type { Customer } from '$lib/types';
	import type { ChosenCustomer } from '$lib/utils';
	import type { SuperForm } from 'sveltekit-superforms';
	import NewCustomerForm from '$lib/components/orders/create/NewCustomerForm.svelte';
	import SearchField from '$lib/components/shared/SearchField.svelte';
	import { Button } from '$lib/components/ui/button';
	import { addressArea } from '$lib/utils';
	import MailIcon from '@lucide/svelte/icons/mail';
	import MapPinIcon from '@lucide/svelte/icons/map-pin';
	import PhoneIcon from '@lucide/svelte/icons/phone';
	import UserPlusIcon from '@lucide/svelte/icons/user-plus';
	import { untrack } from 'svelte';

	type Props = {
		form: SuperForm<NewOrderValues>;
		customers: Customer[];
		selected: ChosenCustomer | null;
		/** Fired when the customer changes, so the delivery address can follow. */
		onchosen: () => void;
	};

	let { form, customers, selected, onchosen }: Props = $props();

	const { form: values, errors } = untrack(() => form);

	/** `search` while looking, `new` while typing someone in, `chosen` after. */
	let step = $state<'search' | 'new' | 'chosen'>('search');
	let query = $state('');

	let results = $derived.by(() => {
		const needle = query.trim().toLowerCase();
		const digits = needle.replace(/\D/g, '');
		const matches = customers.filter((customer) => {
			if (!needle) return true;
			if (customer.name.toLowerCase().includes(needle)) return true;
			return digits.length > 0 && customer.phone.replace(/\D/g, '').includes(digits);
		});
		return matches.slice(0, 5);
	});

	function choose(customer: Customer) {
		$values.customerSource = 'existing';
		$values.customerId = customer.id;
		$errors.customerId = undefined;
		step = 'chosen';
		query = '';
		onchosen();
	}

	function startNewCustomer() {
		$values.customerSource = 'new';
		$values.customerId = '';
		step = 'new';
	}

	function cancelNewCustomer() {
		$values.customerSource = 'existing';
		$values.newCustomer = {
			name: '',
			phone: '',
			email: '',
			area: '',
			block: '',
			road: '',
			building: '',
			extra: ''
		};
		$errors.newCustomer = undefined;
		step = 'search';
	}

	function change() {
		step = $values.customerSource === 'new' ? 'new' : 'search';
	}
</script>

<div class="p-5">
	{#if step === 'chosen' && selected}
		<div class="border-border bg-background flex flex-col gap-3 rounded-lg border p-4 sm:flex-row">
			<div class="min-w-0 flex-1 space-y-1.5">
				<p class="text-foreground font-medium">{selected.name}</p>
				<p class="text-espresso-light flex items-center gap-2 text-sm">
					<PhoneIcon class="text-muted-foreground h-4 w-4 shrink-0" aria-hidden="true" />
					{selected.phone}
				</p>
				{#if selected.email}
					<p class="text-espresso-light flex items-center gap-2 text-sm">
						<MailIcon class="text-muted-foreground h-4 w-4 shrink-0" aria-hidden="true" />
						{selected.email}
					</p>
				{/if}
				<p class="text-espresso-light flex items-start gap-2 text-sm">
					<MapPinIcon class="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
					<span>{selected.address}</span>
				</p>
			</div>
			<div class="shrink-0">
				<Button variant="outline" size="sm" onclick={change}>Change</Button>
			</div>
		</div>
	{:else if step === 'new'}
		<NewCustomerForm
			{form}
			onsaved={() => {
				step = 'chosen';
				onchosen();
			}}
			oncancel={cancelNewCustomer}
		/>
	{:else}
		<SearchField
			id="customer-search"
			label="Search by customer name or phone number"
			placeholder="Search by customer name or phone number"
			value={query}
			autocomplete="off"
			oninput={(event) => (query = event.currentTarget.value)}
			onkeydown={(event) => {
				// Enter would otherwise submit the order sheet from step one.
				if (event.key === 'Enter') event.preventDefault();
			}}
		/>

		<p class="text-muted-foreground mt-3 mb-1.5 text-xs font-medium">
			{query.trim() ? 'Matching customers' : 'Recent customers'}
		</p>

		{#if results.length === 0}
			<p
				class="text-muted-foreground border-border rounded-lg border border-dashed px-4 py-6 text-center text-sm"
			>
				No customer found with that name or number.
			</p>
		{:else}
			<ul class="border-border divide-border divide-y overflow-hidden rounded-lg border">
				{#each results as customer (customer.id)}
					<li>
						<button
							type="button"
							class="hover:bg-muted/60 flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors"
							onclick={() => choose(customer)}
						>
							<span class="min-w-0">
								<span class="text-foreground block truncate font-medium">{customer.name}</span>
								<span class="text-muted-foreground block truncate text-xs">
									{customer.phone} · {addressArea(customer.addresses[0] ?? '')}
								</span>
							</span>
							<span class="text-gold-dark shrink-0 text-sm font-medium">Choose</span>
						</button>
					</li>
				{/each}
			</ul>
		{/if}

		{#if $errors.customerId}
			<p class="text-danger mt-2 text-xs font-medium">{$errors.customerId}</p>
		{/if}

		<Button variant="outline" class="mt-3 w-full sm:w-auto" onclick={startNewCustomer}>
			<UserPlusIcon class="h-4 w-4" aria-hidden="true" />
			Add New Customer
		</Button>
	{/if}
</div>
