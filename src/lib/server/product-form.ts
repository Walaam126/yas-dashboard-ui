import type { ProductFormValues } from '$lib/schemas';
import type { Product } from '$lib/types';
import { toDateInputValue } from '$lib/utils';

/** Blank product used by the create form. */
export const emptyProductForm: ProductFormValues = {
	name: '',
	brand: '',
	category: 'Women',
	productType: 'Bag',
	orderType: 'ready',
	description: '',
	price: 0,
	salePrice: '',
	costPrice: '',
	colors: '',
	sizes: '',
	sku: '',
	trackInventory: true,
	stock: 0,
	lowStockThreshold: 3,
	deliveryAvailability: 'same_day',
	expectedArrival: '',
	orderDeadline: '',
	depositAmount: '',
	preorderNotice: '',
	tourId: '',
	visibility: 'draft',
	featured: false
};

/** Project a catalogue record onto the shape the edit form expects. */
export function productToForm(product: Product): ProductFormValues {
	return {
		...emptyProductForm,
		name: product.name,
		brand: product.brand,
		category: product.category,
		productType: product.productType,
		orderType: product.orderType,
		price: product.price,
		salePrice: product.salePrice ?? '',
		colors: product.colors.join(', '),
		sizes: product.sizes.join(', '),
		sku: product.sku,
		trackInventory: product.stockStatus !== 'not_tracked',
		stock: product.stock,
		visibility: product.visibility,
		featured: product.featured,
		expectedArrival: toDateInputValue(undefined),
		orderDeadline: toDateInputValue(undefined)
	};
}
