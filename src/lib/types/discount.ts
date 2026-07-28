export type DiscountType = 'percentage' | 'fixed' | 'product' | 'category' | 'promo';

export type DiscountStatus = 'active' | 'scheduled' | 'expired' | 'disabled';

export interface Discount {
	id: string;
	name: string;
	code: string;
	type: DiscountType;
	/** Pre-formatted display value, e.g. `15%` or `BHD 5.000`. */
	value: string;
	used: number;
	limit: number;
	start: string;
	end: string;
	status: DiscountStatus;
}
