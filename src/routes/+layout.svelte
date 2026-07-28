<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<svelte:head>
	<title>YAS Outlet Admin</title>
	<meta name="description" content="Admin dashboard for the YAS Outlet boutique store." />
</svelte:head>

{@render children()}

<Toaster />
