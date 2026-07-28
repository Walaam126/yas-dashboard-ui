<script lang="ts">
	import type { Tour } from '$lib/types';
	import { resolve } from '$app/paths';
	import StatusBadge from '$lib/components/dashboard/StatusBadge.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';
	import { bhd, formatDate } from '$lib/utils';
	import MapPinIcon from '@lucide/svelte/icons/map-pin';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import UsersIcon from '@lucide/svelte/icons/users';

	let { tour }: { tour: Tour } = $props();
</script>

<Card class="flex flex-col overflow-hidden">
	<div class="relative h-36">
		<img
			src={tour.image}
			alt="{tour.destination} tour cover"
			class="h-full w-full object-cover"
			loading="lazy"
		/>
		<div class="absolute inset-0 bg-foreground/25" aria-hidden="true"></div>
		<div class="absolute top-3 right-3">
			<StatusBadge kind="tourStatus" value={tour.status} />
		</div>
	</div>
	<div class="flex flex-1 flex-col p-5">
		<h2 class="font-serif text-lg font-semibold text-foreground">{tour.name}</h2>
		<p class="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
			<MapPinIcon class="h-3.5 w-3.5" aria-hidden="true" />
			{tour.destination}
		</p>
		<dl class="mt-4 grid grid-cols-2 gap-3 text-sm">
			<div>
				<dt class="text-xs text-muted-foreground">Order deadline</dt>
				<dd class="font-medium text-foreground">{formatDate(tour.orderDeadline)}</dd>
			</div>
			<div>
				<dt class="text-xs text-muted-foreground">Travel date</dt>
				<dd class="font-medium text-foreground">{formatDate(tour.travelDate)}</dd>
			</div>
			<div>
				<dt class="text-xs text-muted-foreground">Requests</dt>
				<dd class="flex items-center gap-1 font-medium text-foreground">
					<UsersIcon class="h-3.5 w-3.5 text-primary" aria-hidden="true" />
					{tour.requests}
				</dd>
			</div>
			<div>
				<dt class="text-xs text-muted-foreground">Deposits</dt>
				<dd class="font-medium text-foreground">{bhd(tour.deposits)}</dd>
			</div>
		</dl>
		<Button
			variant="outline"
			href={resolve('/admin/tours/[id]', { id: tour.id })}
			class="mt-5 w-full"
		>
			<SettingsIcon class="h-4 w-4" aria-hidden="true" />
			Manage Tour
		</Button>
	</div>
</Card>
