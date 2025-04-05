import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, ProjectStatus } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: Partial<Project>): Promise<Project> {
    const project = this.projectsRepository.create(createProjectDto);
    return this.projectsRepository.save(project);
  }

  async findAll(clientId: number, status?: ProjectStatus): Promise<Project[]> {
    const where: any = { cliente: { id: clientId } };
    if (status) {
      where.estado = status;
    }
    return this.projectsRepository.find({ where });
  }

  async findOne(id: number, clientId: number): Promise<Project> {
    return this.projectsRepository.findOne({
      where: { id, cliente: { id: clientId } },
    });
  }

  async update(
    id: number,
    updateProjectDto: Partial<Project>,
    clientId: number,
  ): Promise<Project> {
    await this.projectsRepository.update(
      { id, cliente: { id: clientId } },
      updateProjectDto,
    );
    return this.findOne(id, clientId);
  }

  async remove(id: number, clientId: number): Promise<void> {
    await this.projectsRepository.delete({ id, cliente: { id: clientId } });
  }
} 