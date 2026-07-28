<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { Toaster } from '$lib/components/ui/sonner';
	import { toast } from 'svelte-sonner';
	import '../app.css';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	// Confirmations that survived a POST-redirect-GET arrive as a one-shot flash.
	$effect(() => {
		if (data.flash) toast.success(data.flash);
	});
</script>

<svelte:head>
	<title>YAS Outlet Admin</title>
	<meta name="description" content="Admin dashboard for the YAS Outlet boutique store." />
</svelte:head>

{@render children()}

<Toaster />
