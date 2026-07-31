<script lang="ts">
	import type { LucideIcon } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Empty from '$lib/components/ui/empty';

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

<!--
	Structure comes from the official Empty primitives; the classes keep the
	mockup's spacing and the gold medallion the registry default does not have.
-->
<Empty.Root class="gap-0 px-6 py-16">
	<Empty.Header class="gap-0">
		<Empty.Media class="bg-gold-soft mb-4 size-14 rounded-full">
			<Icon class="text-gold-dark h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
		</Empty.Media>
		<Empty.Title class="text-foreground font-serif text-xl">{title}</Empty.Title>
		<Empty.Description class="mt-1.5 max-w-sm">{description}</Empty.Description>
	</Empty.Header>
	{#if actionLabel && actionHref}
		<Empty.Content class="mt-5">
			<Button href={actionHref}>{actionLabel}</Button>
		</Empty.Content>
	{:else if actionLabel && onaction}
		<Empty.Content class="mt-5">
			<Button onclick={onaction}>{actionLabel}</Button>
		</Empty.Content>
	{/if}
</Empty.Root>
