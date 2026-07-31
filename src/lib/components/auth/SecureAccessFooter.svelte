<script lang="ts">
	import { cn } from '$lib/utils';
	import ShieldCheckIcon from '@lucide/svelte/icons/shield-check';

	let { class: className }: { class?: string } = $props();
</script>

<div class={cn('flex items-center gap-3 sm:gap-4', className)}>
	<span class="bg-beige-border h-px flex-1" aria-hidden="true"></span>

	<span
		class="text-espresso-muted flex shrink-0 items-center gap-2 text-[13px] sm:gap-2.5 sm:text-sm"
	>
		<ShieldCheckIcon class="text-primary size-3.5 sm:size-4" strokeWidth={1.6} aria-hidden="true" />
		Secure admin access
	</span>

	<span class="bg-beige-border h-px flex-1" aria-hidden="true"></span>
</div>
