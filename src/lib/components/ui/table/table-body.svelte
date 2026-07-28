<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = { children: Snippet };

	let { children }: Props = $props();
</script>

<tbody class="divide-y divide-beige-border">
	{@render children()}
</tbody>
