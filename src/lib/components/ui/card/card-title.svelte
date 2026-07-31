<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn, type WithElementRef } from "$lib/utils.js";

	// YAS: `level` renders a real heading so cards keep their place in the page
	// outline. Omit it for decorative titles, which stay a plain <div>.
	let {
		ref = $bindable(null),
		class: className,
		level,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLElement>> & { level?: 1 | 2 | 3 | 4 } = $props();
</script>

<svelte:element
	this={level ? `h${level}` : "div"}
	bind:this={ref}
	data-slot="card-title"
	class={cn(
		"font-serif text-lg leading-none font-semibold group-data-[size=sm]/card:text-base",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</svelte:element>
