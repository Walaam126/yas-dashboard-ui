import { z } from 'zod';

/** Shortest password the admin sign-in will accept. */
export const PASSWORD_MIN_LENGTH = 8;

export const loginSchema = z.object({
	email: z.string().trim().min(1, 'Email is required').pipe(z.email('Enter a valid email address')),
	password: z
		.string()
		.min(1, 'Password is required')
		.min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`),
	/** Kept on the schema so the checkbox round-trips with the rest of the form. */
	rememberMe: z.boolean().default(false)
});

export type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * Password recovery asks for the address and nothing else, so it borrows the
 * sign-in field rather than restating it — the two screens then reject the same
 * input with the same wording.
 */
export const forgotPasswordSchema = loginSchema.pick({ email: true });

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
