<script lang="ts">
	import type { NoteValues } from '$lib/schemas';
	import type { Customer, Order } from '$lib/types';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { resolve } from '$app/paths';
	import StatusBadge from '$lib/components/dashboard/StatusBadge.svelte';
	import Field from '$lib/components/shared/Field.svelte';
	import InitialsAvatar from '$lib/components/shared/InitialsAvatar.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Textarea } from '$lib/components/ui/textarea';
	import { noteSchema } from '$lib/schemas';
	import { bhd, formatDate } from '$lib/utils';
	import MailIcon from '@lucide/svelte/icons/mail';
	import MapPinIcon from '@lucide/svelte/icons/map-pin';
	import PhoneIcon from '@lucide/svelte/icons/phone';
	import { untrack } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	type Props = {
		customer: Customer;
		history: Order[];
		noteForm: SuperValidated<NoteValues>;
	};

	let { customer, history, noteForm }: Props = $props();

	const form = superForm(
		untrack(() => noteForm),
		{
			validators: zod4Client(noteSchema),
			resetForm: false,
			onUpdated: ({ form: result }) => {
				if (result.valid && result.message) toast.success(result.message);
			}
		}
	);
	const { form: values, enhance, errors, submitting } = form;

	const stats = $derived([
		{ label: 'Orders', value: String(customer.orders) },
		{ label: 'Spent', value: bhd(customer.spent) },
		{ label: 'Last order', value: formatDate(customer.lastOrder) }
	]);
</script>

<div class="space-y-6">
	<div class="flex items-center gap-4">
		<InitialsAvatar name={customer.name} class="size-14" fallbackClass="text-xl" />
		<div>
			<h3 class="font-serif text-xl font-semibold">{customer.name}</h3>
			<div class="mt-1"><StatusBadge kind="customerStatus" value={customer.status} /></div>
		</div>
	</div>

	<div class="grid grid-cols-3 gap-3">
		{#each stats as stat (stat.label)}
			<div class="rounded-lg border border-border bg-card p-3 text-center">
				<p class="font-serif text-lg font-semibold text-foreground">{stat.value}</p>
				<p class="text-xs text-muted-foreground">{stat.label}</p>
			</div>
		{/each}
	</div>

	<Card>
		<CardHeader><CardTitle level={3}>Contact</CardTitle></CardHeader>
		<div class="space-y-3 p-5 text-sm">
			<a
				href="tel:{customer.phone}"
				class="flex items-center gap-2 text-espresso-light hover:text-gold-dark"
			>
				<PhoneIcon class="h-4 w-4 text-muted-foreground" aria-hidden="true" />
				{customer.phone}
			</a>
			<a
				href="mailto:{customer.email}"
				class="flex items-center gap-2 text-espresso-light hover:text-gold-dark"
			>
				<MailIcon class="h-4 w-4 text-muted-foreground" aria-hidden="true" />
				{customer.email}
			</a>
		</div>
	</Card>

	<Card>
		<CardHeader><CardTitle level={3}>Saved Addresses</CardTitle></CardHeader>
		<ul class="divide-y divide-border">
			{#each customer.addresses as address (address)}
				<li class="flex items-start gap-2 p-5 text-sm text-espresso-light">
					<MapPinIcon class="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
					{address}
				</li>
			{/each}
		</ul>
	</Card>

	<Card>
		<CardHeader><CardTitle level={3}>Order History ({history.length})</CardTitle></CardHeader>
		{#if history.length === 0}
			<p class="p-5 text-sm text-muted-foreground">No orders yet.</p>
		{:else}
			<ul class="divide-y divide-border">
				{#each history as order (order.id)}
					<li class="flex items-center justify-between gap-3 p-5 text-sm">
						<div>
							<a
								href={resolve('/admin/orders/[id]', { id: order.id })}
								class="font-medium text-foreground hover:text-gold-dark"
							>
								{order.number}
							</a>
							<p class="text-xs text-muted-foreground">{formatDate(order.date)}</p>
						</div>
						<span class="font-medium text-foreground">{bhd(order.total)}</span>
					</li>
				{/each}
			</ul>
		{/if}
	</Card>

	<Card>
		<CardHeader><CardTitle level={3}>Internal Notes</CardTitle></CardHeader>
		<CardContent>
			<form method="POST" action="?/saveNote" use:enhance>
				<Field id="customer-note" errors={$errors.note}>
					{#snippet control(props)}
						<Textarea
							{...props}
							name="note"
							bind:value={$values.note}
							placeholder="Add a private note about this customer…"
						/>
					{/snippet}
				</Field>
				<Button size="sm" variant="outline" type="submit" class="mt-3" disabled={$submitting}>
					{$submitting ? 'Saving…' : 'Save Note'}
				</Button>
			</form>
		</CardContent>
	</Card>
</div>
