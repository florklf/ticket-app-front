import { Order } from "./Order";

export interface Payment {
    id: number;
    order_id: number;
    order: Order;
    payment_method: string;
    status: string;
    amount: number;
    created_at: string;
    card_type: string;
    card_last4: string;
}