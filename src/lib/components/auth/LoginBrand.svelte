<script lang="ts">
	import StoreIcon from '@lucide/svelte/icons/store';

	/**
	 * The mark is a placeholder — the Store glyph stands in until real artwork
	 * exists. Only the tile below needs to change to swap in a logo component or
	 * an <img>; the type and rule around it stay as they are.
	 */
</script>

<div class="flex flex-col items-center text-center">
	<div
		class="bg-beige flex size-14 items-center justify-center rounded-[14px] sm:size-16 sm:rounded-2xl"
	>
		<StoreIcon class="text-primary size-6.5 sm:size-7" strokeWidth={1.6} aria-hidden="true" />
	</div>

	<!--
		The trailing letter-space of a tracked-out word shifts it off-centre, so
		each line is nudged back by half the tracking it carries.
	-->
	<h1
		class="text-espresso mt-4 pl-[0.18em] font-serif text-[1.625rem] leading-none font-medium tracking-[0.18em] sm:mt-5 sm:text-[1.75rem]"
	>
		YAS OUTLET
	</h1>

	<p
		class="text-primary mt-2 pl-[0.3em] text-[11px] leading-none font-medium tracking-[0.3em] sm:mt-2.5 sm:text-xs"
	>
		ADMIN
	</p>

	<span class="bg-camel-light mt-3.5 block h-px w-12 sm:mt-4 sm:w-14" aria-hidden="true"></span>
</div>
