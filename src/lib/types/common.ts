/** Visual tone shared by every badge, summary card and status pill. */
export type BadgeTone = 'gold' | 'green' | 'amber' | 'red' | 'neutral' | 'blue' | 'camel';

/** A label + tone pairing, used by every status map. */
export interface StatusMeta {
	label: string;
	tone: BadgeTone;
}
