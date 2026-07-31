/**
 * Shared geometry for the sign-in controls, so the email and password fields
 * stay pixel-identical. The registry `Input` is a 36px dashboard control; the
 * login page needs a slightly taller, softer field than that, with room on the
 * left for the leading icon. From `sm` up the field steps up a size along with
 * the rest of the card.
 */
export const authInputClass =
	'border-beige-border bg-surface placeholder:text-espresso-muted/70 h-11 rounded-xl pl-11 text-[15px] shadow-none sm:h-12 sm:pl-12 sm:text-base md:text-base';
