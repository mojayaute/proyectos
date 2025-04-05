import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Client } from '../clients/entities/client.entity';
import { Project } from '../projects/entities/project.entity';
export declare class SeederService {
    private userRepository;
    private clientRepository;
    private projectRepository;
    constructor(userRepository: Repository<User>, clientRepository: Repository<Client>, projectRepository: Repository<Project>);
    seed(): Promise<void>;
    private seedUsers;
    private seedClients;
    private seedProjects;
}
