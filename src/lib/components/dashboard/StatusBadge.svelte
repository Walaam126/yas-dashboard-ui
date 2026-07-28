<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import type {
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

<Badge tone={meta.tone} dot={DOTTED.has(props.kind)} class={props.class}>{meta.label}</Badge>
