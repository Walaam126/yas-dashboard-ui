<script lang="ts">
	import type { SettingsSection } from '$lib/components/settings/sections';
	import type { PageData } from './$types';
	import { page } from '$app/state';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { notificationLabels, paymentMethodDescriptions } from '$lib/components/settings/labels';
	import { isSettingsSection, settingsSections } from '$lib/components/settings/sections';
	import SettingsToggleRow from '$lib/components/settings/SettingsToggleRow.svelte';
	import Field from '$lib/components/shared/Field.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import * as NativeSelect from '$lib/components/ui/native-select';
	import { Switch } from '$lib/components/ui/switch';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Textarea } from '$lib/components/ui/textarea';
	import {
		deliverySettingsSchema,
		notificationSettingsSchema,
		orderSettingsSchema,
		paymentSettingsSchema,
		storeSettingsSchema
	} from '$lib/schemas';
	import { applyParams } from '$lib/utils';
	import { untrack } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	let { data }: { data: PageData } = $props();

	// The open section lives in the URL so it survives a refresh and can be linked.
	let section = $derived<SettingsSection>(
		isSettingsSection(page.url.searchParams.get('section') ?? '')
			? (page.url.searchParams.get('section') as SettingsSection)
			: 'store'
	);

	function announce(name: string) {
		return ({ form }: { form: { valid: boolean; message?: string } }) => {
			if (form.valid && form.message) toast.success(form.message);
			else if (!form.valid) toast.error(`Check the ${name} fields and try again`);
		};
	}

	const storeForm = superForm(
		untrack(() => data.store),
		{
			validators: zod4Client(storeSettingsSchema),
			resetForm: false,
			onUpdated: announce('store details')
		}
	);
	const {
		form: storeValues,
		enhance: storeEnhance,
		errors: storeErrors,
		submitting: storeSubmitting
	} = storeForm;

	const deliveryForm = superForm(
		untrack(() => data.delivery),
		{
			validators: zod4Client(deliverySettingsSchema),
			resetForm: false,
			onUpdated: announce('delivery')
		}
	);
	const {
		form: deliveryValues,
		enhance: deliveryEnhance,
		errors: deliveryErrors,
		submitting: deliverySubmitting
	} = deliveryForm;

	const paymentsForm = superForm(
		untrack(() => data.payments),
		{
			validators: zod4Client(paymentSettingsSchema),
			dataType: 'json',
			resetForm: false,
			onUpdated: announce('payment')
		}
	);
	const {
		form: paymentValues,
		enhance: paymentsEnhance,
		submitting: paymentsSubmitting
	} = paymentsForm;

	const ordersForm = superForm(
		untrack(() => data.orders),
		{
			validators: zod4Client(orderSettingsSchema),
			resetForm: false,
			onUpdated: announce('order')
		}
	);
	const {
		form: orderValues,
		enhance: ordersEnhance,
		errors: orderErrors,
		submitting: ordersSubmitting
	} = ordersForm;

	const notificationsForm = superForm(
		untrack(() => data.notifications),
		{
			validators: zod4Client(notificationSettingsSchema),
			resetForm: false,
			onUpdated: announce('notification')
		}
	);
	const {
		form: notificationValues,
		enhance: notificationsEnhance,
		submitting: notificationsSubmitting
	} = notificationsForm;

	let submitting = $derived(
		$storeSubmitting ||
			$deliverySubmitting ||
			$paymentsSubmitting ||
			$ordersSubmitting ||
			$notificationsSubmitting
	);

	/** Each section is its own form, so the header button submits the open one. */
	let currentFormId = $derived(`settings-${section}-form`);

	// The switcher keeps the mockup's look — a gold pill rather than the default
	// muted track — while Tabs supplies the roving-tabindex keyboard behaviour.
	const tabsListClass =
		'h-auto w-full justify-start gap-1 overflow-x-auto bg-transparent p-0 lg:flex-col lg:items-stretch';
	const tabsTriggerClass =
		'h-auto flex-none justify-start gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium whitespace-nowrap text-espresso-light data-active:bg-gold-soft data-active:text-gold-dark data-active:shadow-none';
</script>

<svelte:head>
	<title>Settings — YAS Outlet Admin</title>
</svelte:head>

<PageHeader title="Settings" description="Configure how your store operates.">
	{#snippet actions()}
		<Button type="submit" form={currentFormId} disabled={submitting}>
			{submitting ? 'Saving…' : 'Save Changes'}
		</Button>
	{/snippet}
</PageHeader>

<Tabs.Root
	value={section}
	onValueChange={(value) =>
		applyParams(page.url, { section: value === 'store' ? null : value })}
	orientation="vertical"
	class="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]"
>
	<Tabs.List class={tabsListClass} aria-label="Settings sections">
		{#each settingsSections as item (item.key)}
			<Tabs.Trigger value={item.key} class={tabsTriggerClass}>
				<item.icon class="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
				{item.label}
			</Tabs.Trigger>
		{/each}
	</Tabs.List>

	<Tabs.Content value="store">
			<Card>
				<CardHeader><CardTitle level={2}>Store Details</CardTitle></CardHeader>
				<form id="settings-store-form" method="POST" action="?/store" use:storeEnhance>
					<div class="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
						<Field id="store-name" label="Store name" errors={$storeErrors.storeName}>
							{#snippet control(props)}
								<Input {...props} name="storeName" bind:value={$storeValues.storeName} />
							{/snippet}
						</Field>
						<Field id="store-email" label="Contact email" errors={$storeErrors.contactEmail}>
							{#snippet control(props)}
								<Input
									{...props}
									name="contactEmail"
									type="email"
									bind:value={$storeValues.contactEmail}
								/>
							{/snippet}
						</Field>
						<Field id="store-whatsapp" label="WhatsApp number" errors={$storeErrors.whatsapp}>
							{#snippet control(props)}
								<Input {...props} name="whatsapp" bind:value={$storeValues.whatsapp} />
							{/snippet}
						</Field>
						<Field id="store-currency" label="Currency" errors={$storeErrors.currency}>
							{#snippet control(props)}
								<NativeSelect.Root {...props} name="currency" bind:value={$storeValues.currency}>
									<NativeSelect.Option value="BHD">BHD — Bahraini Dinar</NativeSelect.Option>
									<NativeSelect.Option value="USD">USD — US Dollar</NativeSelect.Option>
								</NativeSelect.Root>
							{/snippet}
						</Field>
						<Field id="store-language" label="Default language" errors={$storeErrors.language}>
							{#snippet control(props)}
								<NativeSelect.Root {...props} name="language" bind:value={$storeValues.language}>
									<NativeSelect.Option value="en">English</NativeSelect.Option>
									<NativeSelect.Option value="ar">العربية (Arabic)</NativeSelect.Option>
								</NativeSelect.Root>
							{/snippet}
						</Field>
						<Field
							id="store-address"
							label="Store address"
							errors={$storeErrors.address}
							class="sm:col-span-2"
						>
							{#snippet control(props)}
								<Textarea {...props} name="address" bind:value={$storeValues.address} />
							{/snippet}
						</Field>
					</div>
				</form>
			</Card>
	</Tabs.Content>

	<Tabs.Content value="delivery">
			<Card>
				<CardHeader><CardTitle level={2}>Delivery</CardTitle></CardHeader>
				<form id="settings-delivery-form" method="POST" action="?/delivery" use:deliveryEnhance>
					<div class="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
						<Field
							id="delivery-fee"
							label="Delivery fee (BHD)"
							errors={$deliveryErrors.deliveryFee}
						>
							{#snippet control(props)}
								<Input
									{...props}
									name="deliveryFee"
									type="number"
									step="0.001"
									min="0"
									bind:value={$deliveryValues.deliveryFee}
								/>
							{/snippet}
						</Field>
						<Field
							id="delivery-threshold"
							label="Free-delivery threshold (BHD)"
							errors={$deliveryErrors.freeDeliveryThreshold}
						>
							{#snippet control(props)}
								<Input
									{...props}
									name="freeDeliveryThreshold"
									type="number"
									step="0.001"
									min="0"
									bind:value={$deliveryValues.freeDeliveryThreshold}
								/>
							{/snippet}
						</Field>
						<Field
							id="delivery-cutoff"
							label="Order cutoff time"
							hint="For same-day delivery"
							errors={$deliveryErrors.cutoffTime}
						>
							{#snippet control(props)}
								<Input
									{...props}
									name="cutoffTime"
									type="time"
									bind:value={$deliveryValues.cutoffTime}
								/>
							{/snippet}
						</Field>
						<Field id="delivery-areas" label="Delivery areas" errors={$deliveryErrors.areas}>
							{#snippet control(props)}
								<Input {...props} name="areas" bind:value={$deliveryValues.areas} />
							{/snippet}
						</Field>
						<div
							class="flex items-center justify-between gap-4 rounded-lg border border-border bg-background px-3 py-3 sm:col-span-2"
						>
							<div>
								<p class="text-sm font-medium text-foreground">Same-day delivery</p>
								<p class="text-xs text-muted-foreground">
									Offer same-day delivery for eligible orders.
								</p>
							</div>
							<Switch
								name="sameDayDelivery"
								bind:checked={$deliveryValues.sameDayDelivery}
								aria-label="Same-day delivery"
							/>
						</div>
					</div>
				</form>
			</Card>
	</Tabs.Content>

	<Tabs.Content value="payments">
			<Card>
				<CardHeader><CardTitle level={2}>Payments</CardTitle></CardHeader>
				<form id="settings-payments-form" method="POST" action="?/payments" use:paymentsEnhance>
					<div class="divide-y divide-border">
						{#each $paymentValues.methods as method, index (method.name)}
							<SettingsToggleRow
								name={method.name}
								description={paymentMethodDescriptions[method.name] ?? ''}
								field="methods[{index}].enabled"
								bind:checked={$paymentValues.methods[index].enabled}
							/>
						{/each}
					</div>
				</form>
				<p class="border-t border-border p-5 text-xs text-muted-foreground">
					Payment gateway connections are UI-only in this version.
				</p>
			</Card>
	</Tabs.Content>

	<Tabs.Content value="orders">
			<Card>
				<CardHeader><CardTitle level={2}>Order Settings</CardTitle></CardHeader>
				<form id="settings-orders-form" method="POST" action="?/orders" use:ordersEnhance>
					<div class="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
						<Field
							id="orders-default-status"
							label="Default order status"
							errors={$orderErrors.defaultStatus}
						>
							{#snippet control(props)}
								<NativeSelect.Root {...props} name="defaultStatus" bind:value={$orderValues.defaultStatus}>
									<NativeSelect.Option value="new">New</NativeSelect.Option>
									<NativeSelect.Option value="confirmed">Confirmed</NativeSelect.Option>
								</NativeSelect.Root>
							{/snippet}
						</Field>
						<Field
							id="orders-preorder-deposit"
							label="Pre-order deposit (%)"
							errors={$orderErrors.preorderDepositPercent}
						>
							{#snippet control(props)}
								<Input
									{...props}
									name="preorderDepositPercent"
									type="number"
									min="0"
									max="100"
									bind:value={$orderValues.preorderDepositPercent}
								/>
							{/snippet}
						</Field>
						<Field
							id="orders-tour-deposit"
							label="Tour deposit (BHD)"
							errors={$orderErrors.tourDeposit}
						>
							{#snippet control(props)}
								<Input
									{...props}
									name="tourDeposit"
									type="number"
									step="0.001"
									min="0"
									bind:value={$orderValues.tourDeposit}
								/>
							{/snippet}
						</Field>
						<Field
							id="orders-cancellation"
							label="Cancellation policy"
							errors={$orderErrors.cancellationPolicy}
							class="sm:col-span-2"
						>
							{#snippet control(props)}
								<Textarea
									{...props}
									name="cancellationPolicy"
									bind:value={$orderValues.cancellationPolicy}
								/>
							{/snippet}
						</Field>
						<Field
							id="orders-returns"
							label="Return policy"
							errors={$orderErrors.returnPolicy}
							class="sm:col-span-2"
						>
							{#snippet control(props)}
								<Textarea {...props} name="returnPolicy" bind:value={$orderValues.returnPolicy} />
							{/snippet}
						</Field>
					</div>
				</form>
			</Card>
	</Tabs.Content>

	<Tabs.Content value="notifications">
			<Card>
				<CardHeader><CardTitle level={2}>Notifications</CardTitle></CardHeader>
				<form
					id="settings-notifications-form"
					method="POST"
					action="?/notifications"
					use:notificationsEnhance
				>
					<div class="divide-y divide-border">
						{#each notificationLabels as item (item.key)}
							<SettingsToggleRow
								name={item.name}
								description={item.description}
								field={item.key}
								bind:checked={$notificationValues[item.key]}
							/>
						{/each}
					</div>
				</form>
			</Card>
	</Tabs.Content>
</Tabs.Root>
