import type { Tour } from '$lib/types';
import { IMAGES } from './images';

export const tours: Tour[] = [
	{
		id: 't1',
		name: 'Milan Summer Edit',
		destination: 'Milan, Italy',
		image: IMAGES.tour,
		description:
			'Curated designer picks from Milan boutiques — bags, shoes and seasonal ready-to-wear.',
		openingDate: '2026-07-05',
		orderDeadline: '2026-07-30',
		travelDate: '2026-08-02',
		arrivalDate: '2026-08-05',
		requests: 14,
		deposits: 560.0,
		deposit: 40.0,
		status: 'open'
	},
	{
		id: 't2',
		name: 'Paris Autumn Preview',
		destination: 'Paris, France',
		image: IMAGES.tour,
		description: 'Early access to autumn collections from selected Parisian ateliers.',
		openingDate: '2026-08-01',
		orderDeadline: '2026-08-25',
		travelDate: '2026-09-01',
		arrivalDate: '2026-09-05',
		requests: 3,
		deposits: 120.0,
		deposit: 40.0,
		status: 'draft'
	},
	{
		id: 't3',
		name: 'Istanbul Leather Run',
		destination: 'Istanbul, Türkiye',
		image: IMAGES.tour,
		description: 'Hand-picked leather goods and accessories from the Grand Bazaar artisans.',
		openingDate: '2026-05-28',
		orderDeadline: '2026-06-20',
		travelDate: '2026-06-24',
		arrivalDate: '2026-06-28',
		requests: 22,
		deposits: 880.0,
		deposit: 40.0,
		status: 'completed'
	}
];

export function findTour(id: string): Tour | undefined {
	return tours.find((tour) => tour.id === id);
}
