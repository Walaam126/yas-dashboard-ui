<script lang="ts" module>
	import type { BadgeTone } from '$lib/types';
	import { tv } from 'tailwind-variants';

	export const badgeVariants = tv({
		base: 'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
		variants: {
			tone: {
				gold: 'bg-gold-soft text-gold-dark',
				green: 'bg-success-soft text-success',
				amber: 'bg-warning-soft text-warning',
				red: 'bg-danger-soft text-danger',
				blue: 'bg-info-soft text-info',
				camel: 'bg-camel-light text-espresso',
				neutral: 'bg-beige text-espresso-muted'
			} satisfies Record<BadgeTone, string>
		},
		defaultVariants: { tone: 'neutral' }
	});
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	type Props = {
		tone?: BadgeTone;
		/** Render a leading status dot so state is not communicated by colour alone. */
		dot?: boolean;
		class?: string;
		children: Snippet;
	};

	let { tone = 'neutral', dot = false, class: className, children }: Props = $props();
</script>

<span class={cn(badgeVariants({ tone }), className)}>
	{#if dot}
		<span class="h-1.5 w-1.5 rounded-full bg-current opacity-70" aria-hidden="true"></span>
	{/if}
	{@render children()}
</span>
