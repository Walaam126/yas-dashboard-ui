<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const buttonVariants = tv({
		base: 'inline-flex shrink-0 items-center justify-center rounded-lg font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
		variants: {
			variant: {
				primary: 'bg-gold text-white shadow-soft hover:bg-gold-dark active:bg-gold-dark',
				secondary:
					'border border-beige-border bg-surface text-espresso hover:border-camel-dark hover:bg-cream-200',
				ghost: 'text-espresso hover:bg-cream-200',
				danger: 'border border-danger-border bg-danger-soft text-danger hover:bg-danger-hover'
			},
			size: {
				sm: 'h-8 gap-1.5 px-3 text-xs',
				md: 'h-10 gap-2 px-4 text-sm',
				icon: 'h-9 w-9'
			}
		},
		defaultVariants: {
			variant: 'primary',
			size: 'md'
		}
	});

	export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
	export type ButtonSize = VariantProps<typeof buttonVariants>['size'];
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	/** Renders an anchor when `href` is given, otherwise a button. */
	type Props = HTMLButtonAttributes &
		HTMLAnchorAttributes & {
			variant?: ButtonVariant;
			size?: ButtonSize;
			class?: string;
			children: Snippet;
		};

	let {
		variant = 'primary',
		size = 'md',
		class: className,
		href,
		type = 'button',
		children,
		...rest
	}: Props = $props();

	let classes = $derived(cn(buttonVariants({ variant, size }), className));
</script>

{#if href}
	<a {href} class={classes} {...rest}>
		{@render children()}
	</a>
{:else}
	<button {type} class={classes} {...rest}>
		{@render children()}
	</button>
{/if}
