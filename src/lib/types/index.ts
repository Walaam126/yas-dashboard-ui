export type { BadgeTone, StatusMeta } from './common';
export type { Customer, CustomerStatus } from './customer';
export type { Discount, DiscountStatus, DiscountType } from './discount';
export type {
	DeliveryMethod,
	Order,
	OrderActivity,
	OrderItem,
	OrderStatus,
	OrderType,
	PaymentStatus
} from './order';
export type { Category, Product, ProductType, StockStatus, Visibility } from './product';
export { CATEGORIES, PRODUCT_TYPES } from './product';
export type { Tour, TourStatus } from './tour';

/** Daily sales point used by the overview chart. */
export interface SalesPoint {
	day: string;
	value: number;
}
