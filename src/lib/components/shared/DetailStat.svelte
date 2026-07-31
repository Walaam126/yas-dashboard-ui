<script lang="ts">
	type Props = {
		label: string;
		value: string;
	};

	let { label, value }: Props = $props();
</script>

<div>
	<dt class="text-xs text-muted-foreground">{label}</dt>
	<dd class="mt-0.5 font-medium text-foreground">{value}</dd>
</div>
