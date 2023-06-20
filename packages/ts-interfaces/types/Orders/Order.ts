import { EnumEventType } from '../EnumEventType'
import { User } from '../User';
import { OrderItem } from './OrderItem';
import { Payment } from './Paiement';

export interface Order {
    id: number;
    event_type: EnumEventType;
    user_id: number;
    user: User
    billing_address: string;
    billing_city: string;
    billing_country: string;
    billing_zip: string;
    shipping_address: string;
    shipping_city: string;
    shipping_country: string;
    shipping_zip: string;
    snipcart_id: string;
    created_at: string;
    updated_at: string;
    orderItems: OrderItem[];
    paiement: Payment;
}
