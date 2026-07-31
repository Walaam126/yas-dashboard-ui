<script lang="ts">
	import type { OrderLineValues } from '$lib/schemas';
	import SelectField from '$lib/components/shared/SelectField.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { bhd } from '$lib/utils';
	import MinusIcon from '@lucide/svelte/icons/minus';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';

	type Props = {
		line: OrderLineValues;
		sizes: string[];
		colors: string[];
		/** Set when the product cannot be ordered under the chosen order type. */
		warning?: string;
		onqty: (qty: number) => void;
		onsize: (size: string) => void;
		oncolor: (color: string) => void;
		onremove: () => void;
	};

	let { line, sizes, colors, warning, onqty, onsize, oncolor, onremove }: Props = $props();

	let sizeOptions = $derived(sizes.map((size) => ({ value: size, label: size })));
	let colorOptions = $derived(colors.map((color) => ({ value: color, label: color })));
</script>

<li class="flex gap-3 p-4 sm:gap-4 sm:p-5">
	<img
		src={line.image}
		alt={line.name}
		class="border-border h-16 w-16 shrink-0 rounded-lg border object-cover"
		loading="lazy"
	/>

	<div class="min-w-0 flex-1">
		<p class="text-foreground font-medium">{line.name}</p>
		<p class="text-muted-foreground text-xs">{line.brand}</p>

		{#if warning}
			<p class="text-danger mt-1.5 text-xs font-medium">{warning}</p>
		{/if}

		{#if sizeOptions.length > 1 || colorOptions.length > 1}
			<div class="mt-3 grid grid-cols-1 gap-2 sm:max-w-sm sm:grid-cols-2">
				{#if sizeOptions.length > 1}
					<div>
						<Label for="{line.key}-size" class="text-muted-foreground mb-1 block text-xs"
							>Size</Label
						>
						<SelectField
							id="{line.key}-size"
							class="h-9"
							options={sizeOptions}
							value={line.size}
							onValueChange={onsize}
						/>
					</div>
				{/if}
				{#if colorOptions.length > 1}
					<div>
						<Label for="{line.key}-color" class="text-muted-foreground mb-1 block text-xs">
							Colour
						</Label>
						<SelectField
							id="{line.key}-color"
							class="h-9"
							options={colorOptions}
							value={line.color}
							onValueChange={oncolor}
						/>
					</div>
				{/if}
			</div>
		{:else}
			<p class="text-muted-foreground mt-1 text-xs">{line.size} · {line.color}</p>
		{/if}

		<div class="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
			<div class="flex items-center gap-3">
				<div class="border-border flex items-center rounded-lg border">
					<Button
						variant="ghost"
						size="icon-sm"
						class="rounded-r-none"
						disabled={line.qty <= 1}
						onclick={() => onqty(line.qty - 1)}
					>
						<MinusIcon class="h-4 w-4" aria-hidden="true" />
						<span class="sr-only">Remove one {line.name}</span>
					</Button>
					<span class="w-9 text-center text-sm font-medium" aria-live="polite">{line.qty}</span>
					<Button
						variant="ghost"
						size="icon-sm"
						class="rounded-l-none"
						disabled={line.qty >= 99}
						onclick={() => onqty(line.qty + 1)}
					>
						<PlusIcon class="h-4 w-4" aria-hidden="true" />
						<span class="sr-only">Add one {line.name}</span>
					</Button>
				</div>
				<Button variant="ghost" size="sm" class="text-muted-foreground" onclick={onremove}>
					<Trash2Icon class="h-4 w-4" aria-hidden="true" />
					Remove
				</Button>
			</div>

			<div class="text-right">
				<p class="text-muted-foreground text-xs">{bhd(line.price)} each</p>
				<p class="text-foreground font-medium">{bhd(line.price * line.qty)}</p>
			</div>
		</div>
	</div>
</li>
