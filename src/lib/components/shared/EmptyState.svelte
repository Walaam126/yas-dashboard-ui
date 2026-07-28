<script lang="ts">
	import type { LucideIcon } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';

	type Props = {
		icon: LucideIcon;
		title: string;
		description: string;
		actionLabel?: string;
		/** Navigate on action. Mutually exclusive with `onaction`. */
		actionHref?: string;
		onaction?: () => void;
	};

	let { icon: Icon, title, description, actionLabel, actionHref, onaction }: Props = $props();
</script>

<div class="flex flex-col items-center justify-center px-6 py-16 text-center">
	<div class="bg-gold-soft mb-4 flex h-14 w-14 items-center justify-center rounded-full">
		<Icon class="text-gold-dark h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
	</div>
	<h3 class="text-foreground font-serif text-xl">{title}</h3>
	<p class="text-muted-foreground mt-1.5 max-w-sm text-sm">{description}</p>
	{#if actionLabel && actionHref}
		<Button href={actionHref} class="mt-5">{actionLabel}</Button>
	{:else if actionLabel && onaction}
		<Button class="mt-5" onclick={onaction}>{actionLabel}</Button>
	{/if}
</div>
