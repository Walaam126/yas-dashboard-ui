<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Skeleton } from '$lib/components/ui/skeleton';
</script>

<Card role="status" aria-label="Loading">
	<CardContent>
		<Skeleton class="h-3 w-20" />
		<Skeleton class="mt-3 h-7 w-24" />
		<Skeleton class="mt-3 h-3 w-28" />
		<span class="sr-only">Loading…</span>
	</CardContent>
</Card>
