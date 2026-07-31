<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Card, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';

	/**
	 * One numbered step of the order sheet. The number keeps the top-to-bottom
	 * order of the workflow obvious without any extra instructions.
	 */
	type Props = {
		step: number;
		title: string;
		description: string;
		children: Snippet;
	};

	let { step, title, description, children }: Props = $props();
</script>

<Card>
	<CardHeader>
		<CardTitle level={2} class="flex items-center gap-2.5">
			<span
				class="bg-gold-soft text-gold-dark flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-sans text-sm font-semibold"
				aria-hidden="true"
			>
				{step}
			</span>
			{title}
		</CardTitle>
		<CardDescription class="sm:pl-[2.375rem]">{description}</CardDescription>
	</CardHeader>
	{@render children()}
</Card>
