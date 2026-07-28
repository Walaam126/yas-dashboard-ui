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
	class={cn(controlBase, 'select-chevron h-10 appearance-none pr-8', className)}
	{...rest}
>
	{@render children()}
</select>
