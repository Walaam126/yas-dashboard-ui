<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLSelectAttributes } from 'svelte/elements';
	import { controlBase } from '$lib/components/ui/input';
	import { cn } from '$lib/utils';

	type Props = {
		class?: string;
		value?: string;
		children: Snippet;
	} & Omit<HTMLSelectAttributes, 'class' | 'value' | 'children'>;

	let { class: className, value = $bindable(''), children, ...rest }: Props = $props();
</script>

<!--
	A native select keeps the control keyboard- and screen-reader-native, works
	without JavaScript inside progressively enhanced forms, and matches the
	mockup's chevron treatment.
-->
<select
	bind:value
	class={cn(controlBase, 'h-10 appearance-none bg-no-repeat pr-8', className)}
	style:background-image="url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'
	width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238A7A6B'
	stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E&quot;)"
	style:background-position="right 0.6rem center"
	{...rest}
>
	{@render children()}
</select>
