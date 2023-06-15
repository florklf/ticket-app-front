import { SeatType } from './SeatType'

export interface Place {
    id: number;
    name: string;
    description: string;
    capacity: number;
    address: string;
    city: string;
    zip: string;
    seatTypes: SeatType[];
}
