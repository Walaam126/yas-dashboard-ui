<script lang="ts">
	import type { PageData } from './$types';
	import { resolve } from '$app/paths';
	import AuthShell from '$lib/components/auth/AuthShell.svelte';
	import EmailField from '$lib/components/auth/EmailField.svelte';
	import LoginBrand from '$lib/components/auth/LoginBrand.svelte';
	import PasswordField from '$lib/components/auth/PasswordField.svelte';
	import SecureAccessFooter from '$lib/components/auth/SecureAccessFooter.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import { loginSchema } from '$lib/schemas';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	let { data }: { data: PageData } = $props();

	const {
		form: values,
		errors,
		enhance,
		submitting
	} = superForm(data.form, {
		validators: zod4Client(loginSchema),
		/*
		 * `auto` is what keeps a pristine form silent: a field is only validated
		 * once it has been left (blur) or the form has been submitted, never while
		 * it is still untouched.
		 */
		validationMethod: 'auto',
		resetForm: false
	});
</script>

<svelte:head>
	<title>Sign in — YAS Outlet Admin</title>
	<meta name="description" content="Sign in to the YAS Outlet admin dashboard." />
</svelte:head>

<AuthShell>
	<LoginBrand />

	<div class="mt-6 sm:mt-7">
		<h2
			class="text-espresso font-serif text-[1.375rem] leading-tight font-semibold sm:text-[1.625rem]"
		>
			Welcome back
		</h2>
		<p class="text-espresso-muted mt-1 text-sm sm:mt-1.5 sm:text-[15px]">
			Sign in to your admin account
		</p>
	</div>

	<form method="POST" use:enhance class="mt-5 space-y-4 sm:mt-6 sm:space-y-5">
		<EmailField id="login-email" errors={$errors.email} bind:value={$values.email} />

		<PasswordField
			id="login-password"
			name="password"
			errors={$errors.password}
			bind:value={$values.password}
		/>

		<div class="flex items-center justify-between gap-3">
			<div class="flex items-center gap-2.5 sm:gap-3">
				<Checkbox
					id="login-remember"
					name="rememberMe"
					aria-labelledby="login-remember-label"
					bind:checked={$values.rememberMe}
					class="border-camel size-4.5 rounded-[6px] sm:size-5"
				/>
				<Label
					id="login-remember-label"
					for="login-remember"
					class="text-espresso cursor-pointer text-sm font-normal sm:text-[15px]"
				>
					Remember me
				</Label>
			</div>

			<a
				href={resolve('/forgot-password')}
				class="text-primary hover:text-gold-dark shrink-0 rounded-sm text-sm font-medium transition-colors sm:text-[15px]"
			>
				Forgot password?
			</a>
		</div>

		<Button
			type="submit"
			disabled={$submitting}
			class="hover:bg-gold-dark focus-visible:border-espresso/40 focus-visible:ring-espresso/40 h-11 w-full rounded-xl text-[15px] font-medium shadow-none sm:h-12 sm:text-base"
		>
			{#if $submitting}
				<Loader2Icon class="size-4 animate-spin" aria-hidden="true" />
				Signing in...
			{:else}
				Sign in
			{/if}
		</Button>
	</form>

	<SecureAccessFooter class="mt-7 sm:mt-8" />
</AuthShell>
