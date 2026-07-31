<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { cn } from '$lib/utils';
	import MailIcon from '@lucide/svelte/icons/mail';
	import AuthField from './AuthField.svelte';
	import { authInputClass } from './input-class';

	type Props = {
		id: string;
		name?: string;
		label?: string;
		placeholder?: string;
		value: string;
		errors?: string[] | undefined;
	};

	let {
		id,
		name = 'email',
		label = 'Email',
		placeholder = 'Enter your email',
		value = $bindable(''),
		errors
	}: Props = $props();
</script>

<AuthField {id} {label} {errors}>
	{#snippet control(props)}
		<div class="relative">
			<MailIcon
				class="text-espresso-muted/80 pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 sm:left-4 sm:size-4.5"
				strokeWidth={1.6}
				aria-hidden="true"
			/>

			<Input
				{...props}
				{name}
				{placeholder}
				type="email"
				autocomplete="email"
				bind:value
				class={cn(authInputClass, 'pr-4')}
			/>
		</div>
	{/snippet}
</AuthField>
