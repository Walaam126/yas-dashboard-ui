<script lang="ts">
	import { Toaster as Sonner, type ToasterProps } from 'svelte-sonner';

	let { ...rest }: ToasterProps = $props();
</script>

<Sonner
	position="bottom-right"
	toastOptions={{
		classes: {
			toast:
				'!bg-surface !border !border-beige-border !text-espresso !font-sans !rounded-xl !shadow-drawer',
			description: '!text-espresso-muted',
			actionButton: '!bg-gold !text-white',
			cancelButton: '!bg-cream-200 !text-espresso'
		}
	}}
	{...rest}
/>
