<script lang="ts">
	import type { SalesPoint } from '$lib/types';
	import { bhd } from '$lib/utils';

	type Props = {
		data: SalesPoint[];
		height?: number;
	};

	let { data, height = 224 }: Props = $props();

	const PADDING = { top: 10, right: 8, bottom: 24, left: 48 };
	const TICK_COUNT = 5;

	let width = $state(640);
	let hovered = $state<number | null>(null);

	let plotWidth = $derived(Math.max(width - PADDING.left - PADDING.right, 1));
	let plotHeight = $derived(Math.max(height - PADDING.top - PADDING.bottom, 1));

	/** Round the axis maximum up to a readable step, like a charting library would. */
	let yMax = $derived.by(() => {
		const max = Math.max(...data.map((point) => point.value), 0);
		if (max === 0) return 1;
		const magnitude = 10 ** Math.floor(Math.log10(max));
		return Math.ceil(max / magnitude) * magnitude;
	});

	let ticks = $derived(
		Array.from({ length: TICK_COUNT }, (_, i) => Math.round((yMax / (TICK_COUNT - 1)) * i))
	);

	let points = $derived(
		data.map((point, index) => ({
			...point,
			x:
				PADDING.left +
				(data.length === 1 ? plotWidth / 2 : (plotWidth / (data.length - 1)) * index),
			y: PADDING.top + plotHeight - (point.value / yMax) * plotHeight
		}))
	);

	/**
	 * Monotone cubic interpolation (Fritsch–Carlson): a smooth curve that never
	 * overshoots the data, matching the reference chart's `type="monotone"`.
	 */
	function monotonePath(nodes: { x: number; y: number }[]): string {
		if (nodes.length === 0) return '';
		if (nodes.length === 1) return `M ${nodes[0].x} ${nodes[0].y}`;

		const n = nodes.length;
		const dx: number[] = [];
		const slopes: number[] = [];
		for (let i = 0; i < n - 1; i++) {
			dx.push(nodes[i + 1].x - nodes[i].x);
			slopes.push((nodes[i + 1].y - nodes[i].y) / (nodes[i + 1].x - nodes[i].x));
		}

		const tangents: number[] = [slopes[0]];
		for (let i = 1; i < n - 1; i++) {
			if (slopes[i - 1] * slopes[i] <= 0) {
				tangents.push(0);
			} else {
				const w1 = 2 * dx[i] + dx[i - 1];
				const w2 = dx[i] + 2 * dx[i - 1];
				tangents.push((w1 + w2) / (w1 / slopes[i - 1] + w2 / slopes[i]));
			}
		}
		tangents.push(slopes[n - 2]);

		let path = `M ${nodes[0].x} ${nodes[0].y}`;
		for (let i = 0; i < n - 1; i++) {
			const third = dx[i] / 3;
			path += ` C ${nodes[i].x + third} ${nodes[i].y + tangents[i] * third}, ${
				nodes[i + 1].x - third
			} ${nodes[i + 1].y - tangents[i + 1] * third}, ${nodes[i + 1].x} ${nodes[i + 1].y}`;
		}
		return path;
	}

	let linePath = $derived(monotonePath(points));
	let areaPath = $derived(
		points.length > 0
			? `${linePath} L ${points.at(-1)?.x} ${PADDING.top + plotHeight} L ${points[0].x} ${
					PADDING.top + plotHeight
				} Z`
			: ''
	);

	let hoveredPoint = $derived(hovered === null ? null : points[hovered]);

	function handlePointerMove(event: PointerEvent & { currentTarget: SVGSVGElement }) {
		const rect = event.currentTarget.getBoundingClientRect();
		const x = event.clientX - rect.left;
		let nearest = 0;
		let best = Number.POSITIVE_INFINITY;
		points.forEach((point, index) => {
			const distance = Math.abs(point.x - x);
			if (distance < best) {
				best = distance;
				nearest = index;
			}
		});
		hovered = nearest;
	}
</script>

<div class="relative w-full" style:height="{height}px" bind:clientWidth={width}>
	<svg
		{width}
		{height}
		viewBox="0 0 {width} {height}"
		class="overflow-visible"
		role="img"
		aria-label="Sales for the last seven days"
		onpointermove={handlePointerMove}
		onpointerleave={() => (hovered = null)}
	>
		<defs>
			<linearGradient id="sales-gold-fill" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0%" stop-color="#B08D4F" stop-opacity="0.22" />
				<stop offset="100%" stop-color="#B08D4F" stop-opacity="0" />
			</linearGradient>
		</defs>

		<!-- Horizontal grid + value axis -->
		{#each ticks as tick (tick)}
			{@const y = PADDING.top + plotHeight - (tick / yMax) * plotHeight}
			<line
				x1={PADDING.left}
				x2={PADDING.left + plotWidth}
				y1={y}
				y2={y}
				stroke="#E7DCC9"
				stroke-dasharray="3 3"
			/>
			<text
				x={PADDING.left - 10}
				{y}
				text-anchor="end"
				dominant-baseline="middle"
				fill="#8A7A6B"
				font-size="12"
			>
				{tick}
			</text>
		{/each}

		<path d={areaPath} fill="url(#sales-gold-fill)" />
		<path d={linePath} fill="none" stroke="#B08D4F" stroke-width="2" stroke-linecap="round" />

		{#each points as point, index (point.day)}
			<circle cx={point.x} cy={point.y} r={hovered === index ? 5 : 3} fill="#B08D4F" />
			<text x={point.x} y={height - 6} text-anchor="middle" fill="#8A7A6B" font-size="12">
				{point.day}
			</text>
		{/each}

		{#if hoveredPoint}
			<line
				x1={hoveredPoint.x}
				x2={hoveredPoint.x}
				y1={PADDING.top}
				y2={PADDING.top + plotHeight}
				stroke="#D8C4A8"
			/>
			<circle cx={hoveredPoint.x} cy={hoveredPoint.y} r="5" fill="#98763E" />
		{/if}
	</svg>

	{#if hoveredPoint}
		<div
			class="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-border bg-card px-3 py-2 shadow-lg"
			style:left="{Math.min(Math.max(hoveredPoint.x, 56), width - 56)}px"
			style:top="{hoveredPoint.y - 12}px"
			role="status"
		>
			<p class="text-xs font-medium text-muted-foreground">{hoveredPoint.day}</p>
			<p class="text-sm font-semibold text-foreground">{bhd(hoveredPoint.value)}</p>
		</div>
	{/if}

	<!-- Non-visual equivalent of the chart, for assistive technology. -->
	<table class="sr-only">
		<caption>Sales for the last seven days</caption>
		<thead>
			<tr><th scope="col">Day</th><th scope="col">Sales</th></tr>
		</thead>
		<tbody>
			{#each data as point (point.day)}
				<tr><th scope="row">{point.day}</th><td>{bhd(point.value)}</td></tr>
			{/each}
		</tbody>
	</table>
</div>
