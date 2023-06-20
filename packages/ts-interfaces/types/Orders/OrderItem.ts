import { EventSeatType } from "../Events/EventSeatType";
import { QrCode } from "./QrCode";

export interface OrderItem {
    id: number;
    order_id: number;
    seat_type_id: number;
    quantity: number;
    created_at: string;
    updated_at: string;
    qrCode: QrCode[];
    seatType: EventSeatType;
}