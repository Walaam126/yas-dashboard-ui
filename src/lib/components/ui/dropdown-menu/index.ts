import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
import DropdownMenuContent from './dropdown-menu-content.svelte';
import DropdownMenuItem from './dropdown-menu-item.svelte';
import DropdownMenuLabel from './dropdown-menu-label.svelte';
import DropdownMenuSeparator from './dropdown-menu-separator.svelte';

const Root = DropdownMenuPrimitive.Root;
const Trigger = DropdownMenuPrimitive.Trigger;
const Group = DropdownMenuPrimitive.Group;

export {
	DropdownMenuContent as Content,
	Group,
	DropdownMenuItem as Item,
	DropdownMenuLabel as Label,
	Root,
	DropdownMenuSeparator as Separator,
	Trigger
};
