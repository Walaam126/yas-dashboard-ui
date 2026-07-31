<script lang="ts">
	import type {
		BadgeTone,
		CustomerStatus,
		DiscountStatus,
		OrderStatus,
		OrderType,
		PaymentStatus,
		StatusMeta,
		StockStatus,
		TourStatus,
		Visibility
	} from '$lib/types';
	import { Badge } from '$lib/components/ui/badge';
	import {
		customerStatusMap,
		discountStatusMap,
		orderStatusMap,
		orderTypeMap,
		paymentMap,
		stockMap,
		tourStatusMap,
		visibilityMap
	} from '$lib/utils';

	/**
	 * One badge for every status vocabulary in the app. The discriminated union
	 * keeps each `value` tied to its own status type, so an order status can
	 * never be passed as a tour status.
	 */
	type Props =
		| { kind: 'orderStatus'; value: OrderStatus; class?: string }
		| { kind: 'orderType'; value: OrderType; class?: string }
		| { kind: 'payment'; value: PaymentStatus; class?: string }
		| { kind: 'stock'; value: StockStatus; class?: string }
		| { kind: 'visibility'; value: Visibility; class?: string }
		| { kind: 'tourStatus'; value: TourStatus; class?: string }
		| { kind: 'customerStatus'; value: CustomerStatus; class?: string }
		| { kind: 'discountStatus'; value: DiscountStatus; class?: string };

	let props: Props = $props();

	/** Kinds that render a leading dot in the original design. */
	const DOTTED = new Set(['orderStatus', 'stock', 'tourStatus', 'discountStatus']);

	/**
	 * Status tones are a domain vocabulary rather than shadcn's semantic badge
	 * variants — a stock level is not "secondary" or "destructive" — so the
	 * official Badge is composed with the YAS palette instead.
	 */
	const toneClasses: Record<BadgeTone, string> = {
		gold: 'bg-gold-soft text-gold-dark',
		green: 'bg-success-soft text-success',
		amber: 'bg-warning-soft text-warning',
		red: 'bg-danger-soft text-danger',
		blue: 'bg-info-soft text-info',
		camel: 'bg-camel-light text-foreground',
		neutral: 'bg-muted text-muted-foreground'
	};

	let meta: StatusMeta = $derived.by(() => {
		switch (props.kind) {
			case 'orderStatus':
				return orderStatusMap[props.value];
			case 'orderType':
				return orderTypeMap[props.value];
			case 'payment':
				return paymentMap[props.value];
			case 'stock':
				return stockMap[props.value];
			case 'visibility':
				return visibilityMap[props.value];
			case 'tourStatus':
				return tourStatusMap[props.value];
			case 'customerStatus':
				return customerStatusMap[props.value];
			case 'discountStatus':
				return discountStatusMap[props.value];
		}
	});
</script>

<Badge class={[toneClasses[meta.tone], 'gap-1.5 px-2.5', props.class]}>
	{#if DOTTED.has(props.kind)}
		<span class="h-1.5 w-1.5 rounded-full bg-current opacity-70" aria-hidden="true"></span>
	{/if}
	{meta.label}
</Badge>
