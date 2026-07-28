<script lang="ts" module>
	import type { LucideIcon } from '@lucide/svelte';

	export type AttentionTone = 'gold' | 'amber' | 'red';

	export interface AttentionItem {
		icon: LucideIcon;
		text: string;
		/** Already produced by `resolve()` where the list is built. */
		href: string;
		tone: AttentionTone;
	}
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';

	let { items }: { items: AttentionItem[] } = $props();

	const toneClasses: Record<AttentionTone, string> = {
		gold: 'bg-gold-soft text-gold-dark',
		amber: 'bg-warning-soft text-warning',
		red: 'bg-danger-soft text-danger'
	};
</script>

<!--
	Each href is produced with `resolve()` by the caller that assembles the list,
	so the rule has nothing to verify at this anchor.
-->
<!-- eslint-disable svelte/no-navigation-without-resolve -->
<ul class="divide-y divide-beige-border">
	{#each items as item (item.text)}
		<li>
			<a
				href={item.href}
				class="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-cream-100"
			>
				<span
					class={cn(
						'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
						toneClasses[item.tone]
					)}
				>
					<item.icon class="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
				</span>
				<span class="flex-1 text-sm text-espresso">{item.text}</span>
				<ArrowRightIcon class="h-4 w-4 shrink-0 text-espresso-muted" aria-hidden="true" />
			</a>
		</li>
	{/each}
</ul>
