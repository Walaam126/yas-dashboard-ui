import type { PageServerLoad } from './$types';
import { filterProducts } from '$lib/data/product-filters';
import { products } from '$lib/data/products';
import { param } from '$lib/utils';

export const load: PageServerLoad = ({ url }) => {
	const query = {
		search: param(url, 'q', ''),
		category: param(url, 'category'),
		productType: param(url, 'productType'),
		orderType: param(url, 'orderType'),
		stock: param(url, 'stock'),
		visibility: param(url, 'visibility')
	};

	return {
		query,
		view: param(url, 'view', 'table') === 'grid' ? ('grid' as const) : ('table' as const),
		total: products.length,
		// Streamed so the filter bar stays interactive while the list loads.
		results: Promise.resolve(filterProducts(products, query))
	};
};
