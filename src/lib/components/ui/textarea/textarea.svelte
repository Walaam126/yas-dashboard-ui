<script lang="ts">
	import { controlBase } from '$lib/components/ui/input';
	import { cn } from '$lib/utils';
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	type Props = { class?: string; value?: string } & Omit<HTMLTextareaAttributes, 'class' | 'value'>;

	let { class: className, value = $bindable(''), ...rest }: Props = $props();
</script>

<textarea bind:value class={cn(controlBase, 'min-h-20 resize-y py-2', className)} {...rest}
></textarea>
