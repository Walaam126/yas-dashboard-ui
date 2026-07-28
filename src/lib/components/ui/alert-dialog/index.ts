import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';
import AlertDialogContent from './alert-dialog-content.svelte';
import AlertDialogDescription from './alert-dialog-description.svelte';
import AlertDialogOverlay from './alert-dialog-overlay.svelte';
import AlertDialogTitle from './alert-dialog-title.svelte';

const Root = AlertDialogPrimitive.Root;
const Trigger = AlertDialogPrimitive.Trigger;
const Action = AlertDialogPrimitive.Action;
const Cancel = AlertDialogPrimitive.Cancel;
const Portal = AlertDialogPrimitive.Portal;

export {
	Action,
	AlertDialogContent as Content,
	AlertDialogDescription as Description,
	AlertDialogOverlay as Overlay,
	AlertDialogTitle as Title,
	Cancel,
	Portal,
	Root,
	Trigger
};
