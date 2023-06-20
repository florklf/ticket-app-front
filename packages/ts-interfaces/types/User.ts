import { EnumRole } from "./EnumRole";

export interface User {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    role: EnumRole;
    password: string;
    created_at: string;
}