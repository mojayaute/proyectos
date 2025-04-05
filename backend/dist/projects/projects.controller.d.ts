import { ProjectsService } from './projects.service';
import { Project, ProjectStatus } from './entities/project.entity';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(clientId: string, createProjectDto: Partial<Project>): Promise<Project>;
    findAll(clientId: string, status?: ProjectStatus): Promise<Project[]>;
    findOne(id: string, clientId: string): Promise<Project>;
    update(id: string, clientId: string, updateProjectDto: Partial<Project>): Promise<Project>;
    remove(id: string, clientId: string): Promise<void>;
}
