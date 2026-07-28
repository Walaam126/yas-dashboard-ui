export type CustomerStatus = 'active' | 'new' | 'vip' | 'inactive';

export interface Customer {
	id: string;
	name: string;
	phone: string;
	email: string;
	orders: number;
	spent: number;
	lastOrder: string;
	status: CustomerStatus;
	addresses: string[];
	notes?: string;
}
