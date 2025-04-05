import { Repository } from 'typeorm';
import { Project, ProjectStatus } from './entities/project.entity';
export declare class ProjectsService {
    private projectsRepository;
    constructor(projectsRepository: Repository<Project>);
    create(createProjectDto: Partial<Project>): Promise<Project>;
    findAll(clientId: number, status?: ProjectStatus): Promise<Project[]>;
    findOne(id: number, clientId: number): Promise<Project>;
    update(id: number, updateProjectDto: Partial<Project>, clientId: number): Promise<Project>;
    remove(id: number, clientId: number): Promise<void>;
}
