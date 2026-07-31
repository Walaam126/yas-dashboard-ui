<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { cn } from '$lib/utils';
	import EyeIcon from '@lucide/svelte/icons/eye';
	import EyeOffIcon from '@lucide/svelte/icons/eye-off';
	import LockKeyholeIcon from '@lucide/svelte/icons/lock-keyhole';
	import AuthField from './AuthField.svelte';
	import { authInputClass } from './input-class';

	type Props = {
		id: string;
		name: string;
		label?: string;
		placeholder?: string;
		value: string;
		errors?: string[] | undefined;
	};

	let {
		id,
		name,
		label = 'Password',
		placeholder = 'Enter your password',
		value = $bindable(''),
		errors
	}: Props = $props();

	let visible = $state(false);
</script>

<AuthField {id} {label} {errors}>
	{#snippet control(props)}
		<div class="relative">
			<LockKeyholeIcon
				class="text-espresso-muted/80 pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 sm:left-4 sm:size-4.5"
				strokeWidth={1.6}
				aria-hidden="true"
			/>

			<Input
				{...props}
				{name}
				{placeholder}
				type={visible ? 'text' : 'password'}
				autocomplete="current-password"
				bind:value
				class={cn(authInputClass, 'pr-11 sm:pr-12')}
			/>

			<!--
				`type="button"` keeps the toggle out of the submit path. The box stays
				as wide as the field is tall, so the tap target fills the field's
				right edge rather than shrinking to the glyph.
			-->
			<button
				type="button"
				onclick={() => (visible = !visible)}
				aria-label={visible ? 'Hide password' : 'Show password'}
				aria-pressed={visible}
				aria-controls={props.id}
				class="text-espresso-muted/80 hover:text-espresso absolute top-1/2 right-0.5 grid size-10 -translate-y-1/2 place-content-center rounded-lg transition-colors sm:right-1 sm:size-11"
			>
				{#if visible}
					<EyeOffIcon class="size-4 sm:size-4.5" strokeWidth={1.6} aria-hidden="true" />
				{:else}
					<EyeIcon class="size-4 sm:size-4.5" strokeWidth={1.6} aria-hidden="true" />
				{/if}
			</button>
		</div>
	{/snippet}
</AuthField>
