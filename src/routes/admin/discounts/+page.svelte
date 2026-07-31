<script lang="ts">
	import type { Discount } from '$lib/types';
	import type { PageData } from './$types';
	import { page } from '$app/state';
	import StatusBadge from '$lib/components/dashboard/StatusBadge.svelte';
	import DiscountDrawer from '$lib/components/discounts/DiscountDrawer.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import ConfirmAction from '$lib/components/shared/ConfirmAction.svelte';
	import EmptyState from '$lib/components/shared/EmptyState.svelte';
	import TableSkeleton from '$lib/components/shared/TableSkeleton.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Table from '$lib/components/ui/table';
	import { applyParams, discountTypeMap, formatDate } from '$lib/utils';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import MoreHorizontalIcon from '@lucide/svelte/icons/ellipsis';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import TicketPercentIcon from '@lucide/svelte/icons/ticket-percent';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import { toast } from 'svelte-sonner';

	let { data }: { data: PageData } = $props();

	let drawerOpen = $state(false);
	let discountToDelete = $state<Discount | null>(null);
	let deleteOpen = $state(false);

	let drawerTitle = $derived(data.editing ? `Edit ${data.editing.name}` : 'Create Discount');

	async function openCreate() {
		await applyParams(page.url, { edit: null });
		drawerOpen = true;
	}

	async function openEdit(discount: Discount) {
		await applyParams(page.url, { edit: discount.id });
		drawerOpen = true;
	}

	function requestDelete(discount: Discount) {
		discountToDelete = discount;
		deleteOpen = true;
	}
</script>

<svelte:head>
	<title>Discounts — YAS Outlet Admin</title>
</svelte:head>

<PageHeader
	title="Discounts"
	count="{data.total} discounts"
	description="Create promo codes and offers for your customers."
>
	{#snippet actions()}
		<Button onclick={openCreate}>
			<PlusIcon class="h-4 w-4" aria-hidden="true" />
			Create Discount
		</Button>
	{/snippet}
</PageHeader>

{#await data.results}
	<Card><TableSkeleton rows={5} cols={6} /></Card>
{:then discounts}
	<Card>
		{#if discounts.length === 0}
			<EmptyState
				icon={TicketPercentIcon}
				title="No discounts yet"
				description="Create your first promo code or offer to reward customers."
				actionLabel="Create Discount"
				onaction={openCreate}
			/>
		{:else}
			<!-- Desktop table -->
			<div class="hidden md:block">
				<Table.Root class="min-w-[820px]">
					<Table.Header>
					<Table.Row class="hover:bg-transparent">
						<Table.Head class="px-5">Name / Code</Table.Head>
						<Table.Head>Type</Table.Head>
						<Table.Head>Value</Table.Head>
						<Table.Head>Usage</Table.Head>
						<Table.Head>Dates</Table.Head>
						<Table.Head>Status</Table.Head>
						<Table.Head class="w-10"><span class="sr-only">Actions</span></Table.Head>
					</Table.Row>
				</Table.Header>
					<Table.Body>
						{#each discounts as discount (discount.id)}
							<Table.Row>
								<Table.Cell class="px-5">
									<p class="font-medium text-foreground">{discount.name}</p>
									<code class="rounded bg-muted px-1.5 py-0.5 text-xs text-espresso-light">
										{discount.code}
									</code>
								</Table.Cell>
								<Table.Cell class="text-espresso-light">
									{discountTypeMap[discount.type]}
								</Table.Cell>
								<Table.Cell class="font-medium text-foreground">{discount.value}</Table.Cell>
								<Table.Cell class="text-espresso-light">
									{discount.used} / {discount.limit}
								</Table.Cell>
								<Table.Cell class="text-muted-foreground">
									{formatDate(discount.start)} – {formatDate(discount.end)}
								</Table.Cell>
								<Table.Cell>
									<StatusBadge kind="discountStatus" value={discount.status} />
								</Table.Cell>
								<Table.Cell>
									<DropdownMenu.Root>
										<DropdownMenu.Trigger>
											{#snippet child({ props })}
												<Button
													variant="ghost"
													size="icon-sm"
													class="text-muted-foreground"
													{...props}
												>
													<MoreHorizontalIcon class="h-4 w-4" aria-hidden="true" />
													<span class="sr-only">Actions for {discount.name}</span>
												</Button>
											{/snippet}
										</DropdownMenu.Trigger>
										<DropdownMenu.Content align="end">
											<DropdownMenu.Item onSelect={() => openEdit(discount)}>
												<PencilIcon class="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
												Edit
											</DropdownMenu.Item>
											<DropdownMenu.Item
												onSelect={() => toast.success(`${discount.name} duplicated`)}
											>
												<CopyIcon class="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
												Duplicate
											</DropdownMenu.Item>
											<DropdownMenu.Item variant="destructive" onSelect={() => requestDelete(discount)}>
												<Trash2Icon class="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
												Delete
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
			<ul class="divide-y divide-border md:hidden">
				{#each discounts as discount (discount.id)}
					<li class="p-4">
						<div class="flex items-start justify-between gap-3">
							<div class="min-w-0">
								<p class="font-medium text-foreground">{discount.name}</p>
								<code class="rounded bg-muted px-1.5 py-0.5 text-xs text-espresso-light">
									{discount.code}
								</code>
							</div>
							<StatusBadge kind="discountStatus" value={discount.status} />
						</div>
						<div class="mt-2 flex items-center justify-between gap-3 text-sm text-muted-foreground">
							<span>{discountTypeMap[discount.type]} · {discount.value}</span>
							<span>{discount.used}/{discount.limit} used</span>
						</div>
						<div class="mt-3 flex gap-2">
							<Button
								size="sm"
								variant="outline"
								class="flex-1"
								onclick={() => openEdit(discount)}
							>
								<PencilIcon class="h-3.5 w-3.5" aria-hidden="true" />
								Edit
							</Button>
							<Button size="sm" variant="destructive" onclick={() => requestDelete(discount)}>
								<Trash2Icon class="h-3.5 w-3.5" aria-hidden="true" />
								<span class="sr-only">Delete {discount.name}</span>
							</Button>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</Card>
{/await}

<Sheet.Root bind:open={drawerOpen}>
	<!-- Remount the form when switching between create and a specific discount. -->
	{#key data.editing?.id ?? 'new'}
		<DiscountDrawer
			data={data.form}
			title={drawerTitle}
			onsaved={() => (drawerOpen = false)}
			oncancel={() => (drawerOpen = false)}
		/>
	{/key}
</Sheet.Root>

<ConfirmAction
	bind:open={deleteOpen}
	title="Delete this discount?"
	description="This will permanently remove the discount. Existing orders are not affected."
	confirmLabel="Delete Discount"
	onconfirm={() => {
		toast.success(`${discountToDelete?.name} deleted`);
		discountToDelete = null;
	}}
/>
