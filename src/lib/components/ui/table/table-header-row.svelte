<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = { children: Snippet };

	let { children }: Props = $props();
</script>

<thead>
	<tr
		class="border-b border-beige-border text-left text-xs tracking-wide text-espresso-muted uppercase"
	>
		{@render children()}
	</tr>
</thead>
