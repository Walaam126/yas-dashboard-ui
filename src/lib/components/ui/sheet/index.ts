import { Dialog as SheetPrimitive } from 'bits-ui';
import SheetContent, { type SheetSide } from './sheet-content.svelte';
import SheetOverlay from './sheet-overlay.svelte';

const Root = SheetPrimitive.Root;
const Trigger = SheetPrimitive.Trigger;
const Close = SheetPrimitive.Close;
const Portal = SheetPrimitive.Portal;

export {
	Close,
	Portal,
	Root,
	SheetContent as Content,
	SheetOverlay as Overlay,
	Trigger
};
export type { SheetSide };
