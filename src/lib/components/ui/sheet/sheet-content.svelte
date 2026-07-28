<script lang="ts" module>
	import type { VariantProps } from 'tailwind-variants';
	import { tv } from 'tailwind-variants';

	export const sheetVariants = tv({
		base: 'fixed z-50 flex flex-col bg-cream shadow-drawer outline-none',
		variants: {
			side: {
				left: 'inset-y-0 left-0 h-full w-full data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:animate-in data-[state=open]:slide-in-from-left',
				right:
					'inset-y-0 right-0 h-full w-full data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:animate-in data-[state=open]:slide-in-from-right',
				bottom:
					'inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom'
			}
		},
		defaultVariants: { side: 'right' }
	});

	export type SheetSide = NonNullable<VariantProps<typeof sheetVariants>['side']>;
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import XIcon from '@lucide/svelte/icons/x';
	import { Dialog as SheetPrimitive } from 'bits-ui';
	import SheetOverlay from './sheet-overlay.svelte';

	type Props = {
		title: string;
		/** Announced by screen readers alongside the title. */
		description?: string;
		side?: SheetSide;
		/** Max width of a side sheet. Ignored for bottom sheets. */
		widthClass?: string;
		class?: string;
		/** Overrides the padding of the scrollable body. */
		bodyClass?: string;
		/** Replaces the visible title with custom markup; the title stays available to AT. */
		heading?: Snippet;
		children: Snippet;
		footer?: Snippet;
	} & Omit<SheetPrimitive.ContentProps, 'class' | 'children' | 'title'>;

	let {
		title,
		description,
		side = 'right',
		widthClass = 'sm:max-w-xl',
		class: className,
		bodyClass,
		heading,
		children,
		footer,
		...rest
	}: Props = $props();
</script>

<SheetPrimitive.Portal>
	<SheetOverlay />
	<SheetPrimitive.Content
		class={cn(sheetVariants({ side }), side !== 'bottom' && widthClass, className)}
		{...rest}
	>
		<div
			class="flex shrink-0 items-center justify-between gap-3 border-b border-beige-border bg-surface px-5 py-4"
		>
			<div class="min-w-0">
				{#if heading}
					{@render heading()}
				{/if}
				<SheetPrimitive.Title
					class={cn(
						'truncate font-serif text-xl font-semibold text-espresso',
						heading && 'sr-only'
					)}
				>
					{title}
				</SheetPrimitive.Title>
				<SheetPrimitive.Description
					class={cn('text-xs text-espresso-muted', !description && 'sr-only')}
				>
					{description ?? title}
				</SheetPrimitive.Description>
			</div>
			<SheetPrimitive.Close
				class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-espresso-muted transition-colors hover:bg-cream-200 hover:text-espresso"
			>
				<XIcon class="h-5 w-5" aria-hidden="true" />
				<span class="sr-only">Close</span>
			</SheetPrimitive.Close>
		</div>

		<div class={cn('flex-1 overflow-y-auto overscroll-contain p-5', bodyClass)}>
			{@render children()}
		</div>

		{#if footer}
			<div class="shrink-0 border-t border-beige-border bg-surface px-5 py-4">
				{@render footer()}
			</div>
		{/if}
	</SheetPrimitive.Content>
</SheetPrimitive.Portal>
