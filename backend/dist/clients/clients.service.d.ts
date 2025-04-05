import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
export declare class ClientsService {
    private clientsRepository;
    constructor(clientsRepository: Repository<Client>);
    create(createClientDto: Partial<Client>): Promise<Client>;
    findAll(userId: number): Promise<Client[]>;
    findOne(id: number, userId: number): Promise<Client>;
    update(id: number, updateClientDto: Partial<Client>, userId: number): Promise<Client>;
    remove(id: number, userId: number): Promise<void>;
}
