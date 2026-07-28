<script lang="ts">
	import { Button } from '$lib/components/ui/button';
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
		'bg-card hidden shrink-0 flex-col border-r transition-[width] duration-200 lg:flex',
		collapsed ? 'w-[76px]' : 'w-64'
	)}
>
	<div
		class={cn(
			'flex h-16 items-center border-b px-4',
			collapsed ? 'justify-center' : 'justify-between'
		)}
	>
		<Logo compact={collapsed} />
	</div>

	<SidebarNav {collapsed} {pathname} />

	<div class="border-t p-3">
		<Button
			variant="ghost"
			onclick={() => sidebarPreference.toggle()}
			aria-expanded={!collapsed}
			class={cn(
				'text-muted-foreground w-full justify-start gap-3 px-3',
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
		</Button>
	</div>
</aside>

<!-- Mobile drawer -->
<Sheet.Root bind:open={mobileOpen}>
	<Sheet.Content
		side="left"
		class="bg-card gap-0 data-[side=left]:w-64 lg:hidden data-[side=left]:sm:max-w-64"
	>
		<Sheet.Header class="flex-row items-center justify-between border-b px-5 py-4">
			<Logo />
			<Sheet.Title class="sr-only">Admin navigation</Sheet.Title>
			<Sheet.Description class="sr-only">
				Links to every section of the YAS Outlet admin.
			</Sheet.Description>
		</Sheet.Header>
		<div class="flex-1 overflow-y-auto overscroll-contain">
			<SidebarNav {pathname} onnavigate={() => (mobileOpen = false)} />
		</div>
	</Sheet.Content>
</Sheet.Root>
