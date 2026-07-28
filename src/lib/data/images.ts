/**
 * Product and tour imagery, pointing at the original mockup artwork.
 *
 * These are generated-image URLs from the design tool, so they are outside our
 * control and could expire. Equivalent local SVG stand-ins are kept in
 * `static/images/` — swap the values below back to `/images/<name>.svg` if the
 * remote artwork ever stops resolving, or replace both with real product
 * photography when it is available.
 */
export const IMAGES = {
	bag: 'https://cdn.magicpatterns.com/patterns/generated-images/716cc210-2131-467b-8bb1-72fb9ff1ad9b.jpg',
	sneaker:
		'https://cdn.magicpatterns.com/patterns/generated-images/89227719-85d9-44aa-b52b-b2c68bdaa1a7.jpg',
	blazer:
		'https://cdn.magicpatterns.com/patterns/generated-images/f702bc4b-dd4a-4ff1-ab5d-cdf267cd3383.jpg',
	heels:
		'https://cdn.magicpatterns.com/patterns/generated-images/7e750364-abeb-44ae-8cda-ff8f57dc25f8.jpg',
	tour: 'https://cdn.magicpatterns.com/patterns/generated-images/e7e89f99-181b-40f8-b6b9-1a492aa3f264.jpg'
} as const;

/** Offline equivalents of the artwork above, served from `static/images/`. */
export const LOCAL_IMAGES = {
	bag: '/images/bag.svg',
	sneaker: '/images/sneaker.svg',
	blazer: '/images/blazer.svg',
	heels: '/images/heels.svg',
	tour: '/images/tour.svg'
} as const;
