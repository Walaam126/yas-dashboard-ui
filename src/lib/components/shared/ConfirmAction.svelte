<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import AlertTriangleIcon from '@lucide/svelte/icons/triangle-alert';

	type Props = {
		open: boolean;
		title: string;
		description: string;
		confirmLabel?: string;
		cancelLabel?: string;
		destructive?: boolean;
		onconfirm: () => void;
	};

	let {
		open = $bindable(false),
		title,
		description,
		confirmLabel = 'Confirm',
		cancelLabel = 'Cancel',
		destructive = true,
		onconfirm
	}: Props = $props();
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			{#if destructive}
				<AlertDialog.Media
					class="bg-danger-soft text-danger mb-0 size-10 rounded-full *:[svg:not([class*='size-'])]:size-5"
				>
					<AlertTriangleIcon aria-hidden="true" />
				</AlertDialog.Media>
			{/if}
			<AlertDialog.Title class="font-serif text-xl font-semibold">{title}</AlertDialog.Title>
			<AlertDialog.Description>{description}</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>{cancelLabel}</AlertDialog.Cancel>
			<AlertDialog.Action variant={destructive ? 'destructive' : 'default'} onclick={onconfirm}>
				{confirmLabel}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
