import { Client } from '../../clients/entities/client.entity';
export declare class User {
    id: number;
    email: string;
    password_hash: string;
    clients: Client[];
}
