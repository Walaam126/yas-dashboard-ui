<script lang="ts">
	import type { PageData } from './$types';
	import OrderDetail from '$lib/components/orders/OrderDetail.svelte';

	let { data }: { data: PageData } = $props();
</script>

<!--
	Keying on the order id remounts the detail view when navigating between
	orders, so its local status and form state start from the new record.
-->
{#key data.order.id}
	<OrderDetail order={data.order} statusForm={data.statusForm} noteForm={data.noteForm} />
{/key}
