<script lang="ts">
	import { cn } from '$lib/utils';

	type Props = { class?: string };

	let { class: className }: Props = $props();
</script>

<div class={cn('skeleton rounded-md', className)} aria-hidden="true"></div>
