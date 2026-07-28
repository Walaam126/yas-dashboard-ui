<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { sidebarPreference } from '$lib/stores/sidebar.svelte';
	import { cn } from '$lib/utils';
	import PanelLeftCloseIcon from '@lucide/svelte/icons/panel-left-close';
	import PanelLeftOpenIcon from '@lucide/svelte/icons/panel-left-open';
	import Logo from './Logo.svelte';
	import SidebarNav from './SidebarNav.svelte';

	type Props = {
		pathname: string;
		mobileOpen: boolean;
	};

	let { pathname, mobileOpen = $bindable(false) }: Props = $props();

	let collapsed = $derived(sidebarPreference.collapsed);
</script>

<!-- Desktop sidebar -->
<aside
	class={cn(
		'hidden shrink-0 flex-col border-r border-beige-border bg-surface transition-[width] duration-200 lg:flex',
		collapsed ? 'w-[76px]' : 'w-64'
	)}
>
	<div
		class={cn(
			'flex h-16 items-center border-b border-beige-border px-4',
			collapsed ? 'justify-center' : 'justify-between'
		)}
	>
		<Logo compact={collapsed} />
	</div>

	<SidebarNav {collapsed} {pathname} />

	<div class="border-t border-beige-border p-3">
		<button
			type="button"
			onclick={() => sidebarPreference.toggle()}
			aria-expanded={!collapsed}
			class={cn(
				'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-espresso-muted transition-colors hover:bg-cream-200 hover:text-espresso',
				collapsed && 'justify-center px-0'
			)}
		>
			{#if collapsed}
				<PanelLeftOpenIcon class="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
				<span class="sr-only">Expand sidebar</span>
			{:else}
				<PanelLeftCloseIcon class="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
				<span>Collapse</span>
			{/if}
		</button>
	</div>
</aside>

<!-- Mobile drawer -->
<Sheet.Root bind:open={mobileOpen}>
	<Sheet.Content
		title="Admin navigation"
		side="left"
		widthClass="max-w-64"
		bodyClass="p-0"
		class="bg-surface lg:hidden"
	>
		{#snippet heading()}
			<Logo />
		{/snippet}
		<SidebarNav {pathname} onnavigate={() => (mobileOpen = false)} />
	</Sheet.Content>
</Sheet.Root>
