<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';
	import { controlBase } from './styles';

	type Props = { class?: string; value?: HTMLInputAttributes['value'] } & Omit<
		HTMLInputAttributes,
		'class' | 'value'
	>;

	let { class: className, value = $bindable(), ...rest }: Props = $props();
</script>

<input bind:value class={cn(controlBase, 'h-10', className)} {...rest} />
