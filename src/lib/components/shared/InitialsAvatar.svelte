<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import { cn } from '$lib/utils';

	/**
	 * The camel initial disc used for people throughout the admin. Decorative by
	 * default: the person's name is always rendered next to it.
	 */
	type Props = {
		name: string;
		class?: string;
		fallbackClass?: string;
	};

	let { name, class: className, fallbackClass }: Props = $props();

	let initial = $derived(name.trim().charAt(0).toUpperCase());
</script>

<Avatar.Root class={cn('after:hidden', className)} aria-hidden="true">
	<Avatar.Fallback class={cn('bg-camel text-foreground font-serif font-semibold', fallbackClass)}>
		{initial}
	</Avatar.Fallback>
</Avatar.Root>
