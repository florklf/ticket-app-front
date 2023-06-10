import { SeatType } from './SeatType'

export interface EventSeatType {
    id: number;
    price: number;
    available_seats: number;
    event_id: number;
    seat_type_id: number;
    assignedAt: string;
    seatType: SeatType;
}
