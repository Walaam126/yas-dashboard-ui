<script lang="ts" module>
	export interface ChoiceOption {
		value: string;
		label: string;
		/** One short line explaining when to pick this option. */
		description?: string;
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import CheckIcon from '@lucide/svelte/icons/check';

	/**
	 * A small set of choices shown as large, obviously clickable cards rather than
	 * a dropdown — the whole card is the target, and the option's explanation is
	 * visible without opening anything. Built on native radios so keyboard and
	 * screen-reader behaviour comes for free.
	 */
	type Props = {
		options: ChoiceOption[];
		/** The selected value; bindable so Superforms can own it. */
		value?: string;
		/** Radio group name — must be unique on the page. */
		name: string;
		/** Names the group for screen readers. */
		legend: string;
		/** Grid classes for the option layout. */
		class?: string;
		onchange?: (value: string) => void;
	};

	let {
		options,
		value = $bindable(''),
		name,
		legend,
		class: className,
		onchange
	}: Props = $props();
</script>

<fieldset>
	<legend class="sr-only">{legend}</legend>
	<div class={cn('grid gap-2 sm:grid-cols-3', className)}>
		{#each options as option (option.value)}
			<label class="relative block">
				<input
					class="peer sr-only"
					type="radio"
					{name}
					value={option.value}
					disabled={option.disabled}
					bind:group={value}
					onchange={() => onchange?.(option.value)}
				/>
				<span
					class="border-border bg-card hover:border-camel-dark peer-checked:border-primary peer-checked:bg-gold-soft/50 peer-focus-visible:ring-ring peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 block h-full cursor-pointer rounded-lg border px-3.5 py-3 pr-9 transition-colors"
				>
					<span class="text-foreground block text-sm font-medium">{option.label}</span>
					{#if option.description}
						<span class="text-muted-foreground mt-0.5 block text-xs">{option.description}</span>
					{/if}
				</span>
				<CheckIcon
					class="text-gold-dark peer-checked:opacity-100 pointer-events-none absolute top-3.5 right-3 h-4 w-4 opacity-0"
					aria-hidden="true"
				/>
			</label>
		{/each}
	</div>
</fieldset>
