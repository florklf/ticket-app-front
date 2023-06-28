import { EnumRole } from "./EnumRole";
import { Order } from "./Orders/Order";

export interface User {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    role: EnumRole;
    password: string;
    created_at: string;
    Order: Order[];
}