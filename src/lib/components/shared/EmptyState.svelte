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
	<div class="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold-soft">
		<Icon class="h-6 w-6 text-gold-dark" strokeWidth={1.75} aria-hidden="true" />
	</div>
	<h3 class="font-serif text-xl text-espresso">{title}</h3>
	<p class="mt-1.5 max-w-sm text-sm text-espresso-muted">{description}</p>
	{#if actionLabel && actionHref}
		<Button href={actionHref} class="mt-5">{actionLabel}</Button>
	{:else if actionLabel && onaction}
		<Button class="mt-5" onclick={onaction}>{actionLabel}</Button>
	{/if}
</div>
