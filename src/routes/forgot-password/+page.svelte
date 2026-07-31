<script lang="ts">
	import type { PageData } from './$types';
	import { resolve } from '$app/paths';
	import AuthMedallion from '$lib/components/auth/AuthMedallion.svelte';
	import AuthShell from '$lib/components/auth/AuthShell.svelte';
	import EmailField from '$lib/components/auth/EmailField.svelte';
	import LoginBrand from '$lib/components/auth/LoginBrand.svelte';
	import SecureAccessFooter from '$lib/components/auth/SecureAccessFooter.svelte';
	import { Button } from '$lib/components/ui/button';
	import { forgotPasswordSchema } from '$lib/schemas';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import LockKeyholeIcon from '@lucide/svelte/icons/lock-keyhole';
	import MailIcon from '@lucide/svelte/icons/mail';
	import MailCheckIcon from '@lucide/svelte/icons/mail-check';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	let { data }: { data: PageData } = $props();

	const {
		form: values,
		errors,
		enhance,
		submitting,
		message
	} = superForm(data.form, {
		validators: zod4Client(forgotPasswordSchema),
		/*
		 * `auto` is what keeps a pristine form silent: the field is only validated
		 * once it has been left (blur) or the form has been submitted, never while
		 * it is still untouched.
		 */
		validationMethod: 'auto',
		resetForm: false
	});

	/*
	 * The action answers with the address it accepted, so a message means the link
	 * is on its way and the card can swap to its confirmation face. The store is
	 * untyped, hence the narrowing rather than a plain truthiness check.
	 */
	let sentTo = $derived(typeof $message === 'string' ? $message : null);
</script>

<svelte:head>
	<title>Reset password — YAS Outlet Admin</title>
	<meta name="description" content="Request a password reset link for the YAS Outlet admin." />
</svelte:head>

<AuthShell>
	<LoginBrand />

	{#if sentTo}
		<AuthMedallion class="mt-7 sm:mt-8">
			<MailCheckIcon class="text-primary size-8 sm:size-9" strokeWidth={1.4} aria-hidden="true" />
		</AuthMedallion>

		<div class="mt-4 text-center sm:mt-5">
			<h2
				class="text-espresso font-serif text-[1.5rem] leading-tight font-semibold sm:text-[1.75rem]"
			>
				Check your email
			</h2>
			<p
				class="text-espresso-muted mx-auto mt-2 max-w-77 text-sm leading-relaxed sm:mt-2.5 sm:text-[15px]"
			>
				We sent a reset link to <span class="text-espresso font-medium break-all">{sentTo}</span>.
				It may take a minute to arrive.
			</p>
		</div>

		<Button
			href={resolve('/login')}
			class="hover:bg-gold-dark focus-visible:border-espresso/40 focus-visible:ring-espresso/40 mt-6 h-11 w-full rounded-xl text-[15px] font-medium shadow-none sm:mt-7 sm:h-12 sm:text-base"
		>
			Back to sign in
		</Button>

		<div class="mt-6 flex items-center gap-4 sm:mt-7">
			<span class="bg-beige-border h-px flex-1" aria-hidden="true"></span>
			<span class="text-espresso-muted shrink-0 text-[13px] sm:text-sm">or</span>
			<span class="bg-beige-border h-px flex-1" aria-hidden="true"></span>
		</div>

		<!-- Nothing was sent anywhere, so returning to the form is just clearing the message. -->
		<button
			type="button"
			onclick={() => ($message = undefined)}
			class="text-primary hover:text-gold-dark mx-auto mt-5 block rounded-sm text-[15px] font-medium transition-colors sm:mt-6 sm:text-base"
		>
			Use a different email
		</button>
	{:else}
		<AuthMedallion class="mt-7 sm:mt-8">
			<!--
				Lucide has no envelope-with-lock glyph, so the padlock is a separate
				chip notched into the envelope's corner, cut out of the card colour.
			-->
			<span class="relative block">
				<MailIcon class="text-primary size-8 sm:size-9" strokeWidth={1.4} aria-hidden="true" />
				<span
					class="bg-surface absolute -right-2 -bottom-2 grid size-5.5 place-content-center rounded-full sm:size-6"
				>
					<LockKeyholeIcon
						class="text-primary size-3 sm:size-3.5"
						strokeWidth={1.8}
						aria-hidden="true"
					/>
				</span>
			</span>
		</AuthMedallion>

		<div class="mt-4 text-center sm:mt-5">
			<h2
				class="text-espresso font-serif text-[1.5rem] leading-tight font-semibold sm:text-[1.75rem]"
			>
				Forgot password?
			</h2>
			<p
				class="text-espresso-muted mx-auto mt-2 max-w-77 text-sm leading-relaxed sm:mt-2.5 sm:text-[15px]"
			>
				No worries! Enter your email address and we’ll send you a link to reset your password.
			</p>
		</div>

		<form method="POST" use:enhance class="mt-6 space-y-4 sm:mt-7 sm:space-y-5">
			<EmailField
				id="forgot-email"
				label="Email address"
				errors={$errors.email}
				bind:value={$values.email}
			/>

			<Button
				type="submit"
				disabled={$submitting}
				class="hover:bg-gold-dark focus-visible:border-espresso/40 focus-visible:ring-espresso/40 h-11 w-full rounded-xl text-[15px] font-medium shadow-none sm:h-12 sm:text-base"
			>
				{#if $submitting}
					<Loader2Icon class="size-4 animate-spin" aria-hidden="true" />
					Sending link...
				{:else}
					Send reset link
				{/if}
			</Button>
		</form>

		<div class="mt-6 flex items-center gap-4 sm:mt-7">
			<span class="bg-beige-border h-px flex-1" aria-hidden="true"></span>
			<span class="text-espresso-muted shrink-0 text-[13px] sm:text-sm">or</span>
			<span class="bg-beige-border h-px flex-1" aria-hidden="true"></span>
		</div>

		<a
			href={resolve('/login')}
			class="text-primary hover:text-gold-dark mt-5 flex items-center justify-center gap-2.5 rounded-sm text-[15px] font-medium transition-colors sm:mt-6 sm:text-base"
		>
			<ArrowLeftIcon class="size-4 sm:size-4.5" strokeWidth={1.8} aria-hidden="true" />
			Back to sign in
		</a>
	{/if}

	<SecureAccessFooter class="mt-7 sm:mt-8" />
</AuthShell>
