import type { Product } from '$lib/types';

export const PRODUCT_FILTER_KEYS = [
	'category',
	'productType',
	'orderType',
	'stock',
	'visibility'
] as const;

export interface ProductQuery {
	search: string;
	category: string;
	productType: string;
	orderType: string;
	stock: string;
	visibility: string;
}

export function filterProducts(products: Product[], query: ProductQuery): Product[] {
	const needle = query.search.trim().toLowerCase();

	return products.filter((product) => {
		if (query.category !== 'all' && product.category !== query.category) return false;
		if (query.productType !== 'all' && product.productType !== query.productType) return false;
		if (query.orderType !== 'all' && product.orderType !== query.orderType) return false;
		if (query.stock !== 'all' && product.stockStatus !== query.stock) return false;
		if (query.visibility !== 'all' && product.visibility !== query.visibility) return false;
		if (needle) {
			const haystack = `${product.name} ${product.brand} ${product.sku}`.toLowerCase();
			if (!haystack.includes(needle)) return false;
		}
		return true;
	});
}
