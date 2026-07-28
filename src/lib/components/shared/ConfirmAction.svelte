<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { buttonVariants } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
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
		<div class="flex gap-4">
			{#if destructive}
				<div
					class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-danger-soft"
				>
					<AlertTriangleIcon class="h-5 w-5 text-danger" aria-hidden="true" />
				</div>
			{/if}
			<div>
				<AlertDialog.Title>{title}</AlertDialog.Title>
				<AlertDialog.Description>{description}</AlertDialog.Description>
			</div>
		</div>
		<div class="mt-6 flex justify-end gap-3">
			<AlertDialog.Cancel class={cn(buttonVariants({ variant: 'secondary' }))}>
				{cancelLabel}
			</AlertDialog.Cancel>
			<AlertDialog.Action
				class={cn(buttonVariants({ variant: destructive ? 'danger' : 'primary' }))}
				onclick={onconfirm}
			>
				{confirmLabel}
			</AlertDialog.Action>
		</div>
	</AlertDialog.Content>
</AlertDialog.Root>
