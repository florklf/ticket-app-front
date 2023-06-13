import { SeatType } from './Events/SeatType'
export { }

declare global {

    export interface EventSeatType {
        id: number;
        price: number;
        available_seats: number;
        event_id: number;
        seat_type_id: number;
        assignedAt: string;
        seatType: SeatType;
    }
}
