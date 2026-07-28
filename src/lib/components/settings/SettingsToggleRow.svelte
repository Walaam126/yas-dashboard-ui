<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Switch } from '$lib/components/ui/switch';

	type Props = {
		name: string;
		description: string;
		checked: boolean;
		/** Form field name, so the value posts with the section's form. */
		field: string;
	};

	let { name, description, checked = $bindable(false), field }: Props = $props();
</script>

<div class="flex items-center justify-between gap-4 p-5">
	<div>
		<p class="flex flex-wrap items-center gap-2 text-sm font-medium text-foreground">
			{name}
			{#if checked}
				<Badge class="bg-success-soft text-success">Enabled</Badge>
			{:else}
				<Badge variant="secondary">Disabled</Badge>
			{/if}
		</p>
		<p class="text-xs text-muted-foreground">{description}</p>
	</div>
	<Switch name={field} bind:checked aria-label={name} />
</div>
