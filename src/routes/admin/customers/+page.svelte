<script lang="ts">
	import type { Customer } from '$lib/types';
	import type { PageData } from './$types';
	import { page } from '$app/state';
	import CustomerDetails from '$lib/components/customers/CustomerDetails.svelte';
	import SearchInput from '$lib/components/dashboard/SearchInput.svelte';
	import StatusBadge from '$lib/components/dashboard/StatusBadge.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import EmptyState from '$lib/components/shared/EmptyState.svelte';
	import { Card } from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Table from '$lib/components/ui/table';
	import { applyParams, bhd, formatDate } from '$lib/utils';
	import MoreHorizontalIcon from '@lucide/svelte/icons/ellipsis';
	import EyeIcon from '@lucide/svelte/icons/eye';
	import MailIcon from '@lucide/svelte/icons/mail';
	import UsersIcon from '@lucide/svelte/icons/users';
	import { toast } from 'svelte-sonner';

	let { data }: { data: PageData } = $props();

	// The open drawer lives in the URL so a customer can be linked to directly.
	let drawerOpen = $derived(data.selected !== null);

	function openCustomer(customer: Customer) {
		applyParams(page.url, { customer: customer.id });
	}

	function closeDrawer(open: boolean) {
		if (!open) applyParams(page.url, { customer: null });
	}
</script>

<svelte:head>
	<title>Customers — YAS Outlet Admin</title>
</svelte:head>

<PageHeader
	title="Customers"
	count="{data.total} customers"
	description="Your customer directory and their order history."
>
	{#snippet actions()}
		<SearchInput
			value={data.search}
			label="Search customers"
			placeholder="Search name, phone, email…"
			class="w-full sm:w-72"
			onsearch={(value) => applyParams(page.url, { q: value })}
		/>
	{/snippet}
</PageHeader>

<Card>
	{#if data.customers.length === 0}
		<EmptyState
			icon={UsersIcon}
			title="No customers found"
			description="No customers match your search."
		/>
	{:else}
		<!-- Desktop table -->
		<div class="hidden md:block">
			<Table.Root minWidthClass="min-w-[820px]">
				<Table.HeaderRow>
					<Table.Head class="px-5">Customer</Table.Head>
					<Table.Head>Phone</Table.Head>
					<Table.Head>Orders</Table.Head>
					<Table.Head>Total Spent</Table.Head>
					<Table.Head>Last Order</Table.Head>
					<Table.Head>Status</Table.Head>
					<Table.Head class="w-10"><span class="sr-only">Actions</span></Table.Head>
				</Table.HeaderRow>
				<Table.Body>
					{#each data.customers as customer (customer.id)}
						<Table.Row>
							<Table.Cell class="px-5">
								<div class="flex items-center gap-3">
									<span
										class="flex h-9 w-9 items-center justify-center rounded-full bg-camel font-serif text-sm font-semibold text-espresso"
										aria-hidden="true"
									>
										{customer.name.charAt(0)}
									</span>
									<div>
										<button
											type="button"
											onclick={() => openCustomer(customer)}
											class="font-medium text-espresso hover:text-gold-dark"
										>
											{customer.name}
										</button>
										<p class="text-xs text-espresso-muted">{customer.email}</p>
									</div>
								</div>
							</Table.Cell>
							<Table.Cell class="text-espresso-light">{customer.phone}</Table.Cell>
							<Table.Cell class="text-espresso">{customer.orders}</Table.Cell>
							<Table.Cell class="font-medium text-espresso">{bhd(customer.spent)}</Table.Cell>
							<Table.Cell class="text-espresso-muted">{formatDate(customer.lastOrder)}</Table.Cell>
							<Table.Cell>
								<StatusBadge kind="customerStatus" value={customer.status} />
							</Table.Cell>
							<Table.Cell>
								<DropdownMenu.Root>
									<DropdownMenu.Trigger
										class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-espresso-muted transition-colors hover:bg-cream-200 hover:text-espresso"
									>
										<MoreHorizontalIcon class="h-4 w-4" aria-hidden="true" />
										<span class="sr-only">Actions for {customer.name}</span>
									</DropdownMenu.Trigger>
									<DropdownMenu.Content>
										<DropdownMenu.Item onSelect={() => openCustomer(customer)}>
											<EyeIcon class="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
											View details
										</DropdownMenu.Item>
										<DropdownMenu.Item onSelect={() => toast('Opening email…')}>
											<MailIcon class="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
											Email customer
										</DropdownMenu.Item>
									</DropdownMenu.Content>
								</DropdownMenu.Root>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>

		<!-- Mobile cards -->
		<ul class="divide-y divide-beige-border md:hidden">
			{#each data.customers as customer (customer.id)}
				<li>
					<button
						type="button"
						onclick={() => openCustomer(customer)}
						class="flex w-full items-center gap-3 p-4 text-left hover:bg-cream-100"
					>
						<span
							class="flex h-10 w-10 items-center justify-center rounded-full bg-camel font-serif font-semibold text-espresso"
							aria-hidden="true"
						>
							{customer.name.charAt(0)}
						</span>
						<div class="min-w-0 flex-1">
							<p class="font-medium text-espresso">{customer.name}</p>
							<p class="text-xs text-espresso-muted">{customer.phone}</p>
						</div>
						<div class="text-right">
							<p class="font-medium text-espresso">{bhd(customer.spent)}</p>
							<p class="text-xs text-espresso-muted">{customer.orders} orders</p>
						</div>
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</Card>

<Sheet.Root open={drawerOpen} onOpenChange={closeDrawer}>
	{#if data.selected}
		<Sheet.Content title="Customer Details" description={data.selected.name}>
			{#key data.selected.id}
				<CustomerDetails customer={data.selected} history={data.history} noteForm={data.noteForm} />
			{/key}
		</Sheet.Content>
	{/if}
</Sheet.Root>
