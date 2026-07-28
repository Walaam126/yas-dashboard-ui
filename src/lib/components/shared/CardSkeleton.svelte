<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';
</script>

<div class="rounded-xl border border-beige-border bg-surface p-5" role="status" aria-label="Loading">
	<Skeleton class="h-3 w-20" />
	<Skeleton class="mt-3 h-7 w-24" />
	<Skeleton class="mt-3 h-3 w-28" />
	<span class="sr-only">Loading…</span>
</div>
