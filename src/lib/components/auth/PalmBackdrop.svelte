<script lang="ts">
	/**
	 * Purely decorative: soft, heavily blurred palm-frond shadows raking across the
	 * page, plus the warm light band they fall through. Built from a handful of
	 * ellipses rather than a photograph so it stays a few hundred bytes and never
	 * competes with the form for attention.
	 *
	 * It carries no meaning, so it is hidden from assistive tech and ignores the
	 * pointer. There is no animation here, so `prefers-reduced-motion` has nothing
	 * to suppress.
	 */

	/** Leaflets fanning out along the frond's spine, tapering toward the tip. */
	const leaflets = [
		{ x: 50, r: 48 },
		{ x: 95, r: 58 },
		{ x: 140, r: 66 },
		{ x: 185, r: 70 },
		{ x: 230, r: 70 },
		{ x: 275, r: 64 },
		{ x: 320, r: 55 },
		{ x: 360, r: 44 },
		{ x: 395, r: 32 }
	];

	/** Each frond is placed toward an outer edge so the centre stays clean. */
	const fronds = [
		'translate(-160 -120) rotate(32) scale(1.5)',
		'translate(-170 470) rotate(18) scale(1.45)',
		'translate(1520 -40) rotate(150) scale(1.4)',
		'translate(1560 1080) rotate(212) scale(1.7)'
	];
</script>

<div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
	<!-- Warm cream ground, brightest toward the upper right. -->
	<div
		class="absolute inset-0"
		style="background:
			radial-gradient(120% 90% at 78% 6%, #fdfbf5 0%, rgb(253 251 245 / 0) 58%),
			linear-gradient(155deg, #f1eade 0%, #faf6ef 38%, #f7f1e6 70%, #ece4d5 100%);"
	></div>

	<svg
		class="absolute inset-0 h-full w-full"
		viewBox="0 0 1440 1000"
		preserveAspectRatio="xMidYMid slice"
		focusable="false"
	>
		<defs>
			<filter id="palm-blur" x="-25%" y="-25%" width="150%" height="150%">
				<feGaussianBlur stdDeviation="22" />
			</filter>

			<g id="palm-frond">
				<!-- Spine -->
				<path d="M0 0 C140 -4 280 -2 420 4 L420 12 C280 6 140 4 0 10 Z" />
				{#each leaflets as leaf (leaf.x)}
					<g transform="translate({leaf.x} 2) rotate(-34)">
						<ellipse cx={leaf.r} cy="0" rx={leaf.r} ry="11" />
					</g>
					<g transform="translate({leaf.x} 6) rotate(34)">
						<ellipse cx={leaf.r} cy="0" rx={leaf.r} ry="11" />
					</g>
				{/each}
			</g>
		</defs>

		<g filter="url(#palm-blur)" fill="#6b5744" opacity="0.13">
			{#each fronds as transform (transform)}
				<use href="#palm-frond" {transform} />
			{/each}
		</g>
	</svg>

	<!-- The bright diagonal shaft the fronds are lit by, laid over the shadows. -->
	<div
		class="absolute inset-0"
		style="background: linear-gradient(
			118deg,
			rgb(255 253 247 / 0) 26%,
			rgb(255 253 247 / 0.55) 42%,
			rgb(255 253 247 / 0.55) 56%,
			rgb(255 253 247 / 0) 70%
		);"
	></div>
</div>
