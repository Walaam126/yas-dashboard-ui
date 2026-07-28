import type { OrderType } from './order';

export type StockStatus = 'in_stock' | 'low_stock' | 'out_stock' | 'not_tracked';

export type Visibility = 'published' | 'draft' | 'hidden';

export type Category = 'Women' | 'Men' | 'Kids';

export type ProductType = 'Bag' | 'Shoes' | 'Clothes' | 'Accessories';

export interface Product {
	id: string;
	name: string;
	brand: string;
	image: string;
	category: Category;
	productType: ProductType;
	orderType: OrderType;
	price: number;
	salePrice?: number;
	stock: number;
	stockStatus: StockStatus;
	visibility: Visibility;
	featured: boolean;
	sku: string;
	updated: string;
	colors: string[];
	sizes: string[];
}

export const CATEGORIES: readonly Category[] = ['Women', 'Men', 'Kids'];
export const PRODUCT_TYPES: readonly ProductType[] = ['Bag', 'Shoes', 'Clothes', 'Accessories'];
