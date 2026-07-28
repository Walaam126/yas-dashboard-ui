<script lang="ts">
	type Props = { compact?: boolean };

	let { compact = false }: Props = $props();
</script>

{#if compact}
	<div
		class="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground font-serif text-lg font-semibold text-background"
		aria-hidden="true"
	>
		Y
	</div>
	<span class="sr-only">YAS Outlet Admin</span>
{:else}
	<div class="leading-none">
		<div class="font-serif text-xl font-semibold tracking-[0.18em] text-foreground">YAS OUTLET</div>
		<div class="mt-1 text-[10px] font-medium tracking-[0.3em] text-primary uppercase">Admin</div>
	</div>
{/if}
