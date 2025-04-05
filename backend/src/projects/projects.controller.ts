import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project, ProjectStatus } from './entities/project.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('clients/:clientId/projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(
    @Param('clientId') clientId: string,
    @Body() createProjectDto: Partial<Project>,
  ) {
    return this.projectsService.create({
      ...createProjectDto,
      cliente: { id: +clientId } as any,
    });
  }

  @Get()
  findAll(
    @Param('clientId') clientId: string,
    @Query('status') status?: ProjectStatus,
  ) {
    return this.projectsService.findAll(+clientId, status);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Param('clientId') clientId: string) {
    return this.projectsService.findOne(+id, +clientId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Param('clientId') clientId: string,
    @Body() updateProjectDto: Partial<Project>,
  ) {
    return this.projectsService.update(+id, updateProjectDto, +clientId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Param('clientId') clientId: string) {
    return this.projectsService.remove(+id, +clientId);
  }
} 