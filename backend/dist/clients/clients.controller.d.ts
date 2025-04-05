import { ClientsService } from './clients.service';
import { Client } from './entities/client.entity';
export declare class ClientsController {
    private readonly clientsService;
    constructor(clientsService: ClientsService);
    create(createClientDto: Partial<Client>, req: any): Promise<Client>;
    findAll(req: any): Promise<Client[]>;
    findOne(id: string, req: any): Promise<Client>;
    update(id: string, updateClientDto: Partial<Client>, req: any): Promise<Client>;
    remove(id: string, req: any): Promise<void>;
}
