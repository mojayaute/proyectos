import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Client } from '../clients/entities/client.entity';
import { Project, ProjectStatus } from '../projects/entities/project.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async seed() {
    await this.seedUsers();
    await this.seedClients();
    await this.seedProjects();
  }

  private async seedUsers() {
    const users = [
      {
        email: 'admin@example.com',
        password_hash: await bcrypt.hash('admin123', 10),
      },
      {
        email: 'user@example.com',
        password_hash: await bcrypt.hash('user123', 10),
      },
    ];

    for (const user of users) {
      const exists = await this.userRepository.findOne({ where: { email: user.email } });
      if (!exists) {
        await this.userRepository.save(user);
      }
    }
  }

  private async seedClients() {
    const admin = await this.userRepository.findOne({ where: { email: 'admin@example.com' } });
    const user = await this.userRepository.findOne({ where: { email: 'user@example.com' } });

    const clients = [
      {
        nombre: 'Cliente 1',
        correo: 'cliente1@example.com',
        telefono: '1234567890',
        user: admin,
      },
      {
        nombre: 'Cliente 2',
        correo: 'cliente2@example.com',
        telefono: '0987654321',
        user: admin,
      },
      {
        nombre: 'Cliente 3',
        correo: 'cliente3@example.com',
        telefono: '5555555555',
        user: user,
      },
    ];

    for (const client of clients) {
      const exists = await this.clientRepository.findOne({ 
        where: { 
          correo: client.correo,
          user: { id: client.user.id }
        } 
      });
      if (!exists) {
        await this.clientRepository.save(client);
      }
    }
  }

  private async seedProjects() {
    const clients = await this.clientRepository.find({ relations: ['user'] });
    const statuses = Object.values(ProjectStatus);

    for (const client of clients) {
      const projects = [
        {
          nombre: `Proyecto 1 - ${client.nombre}`,
          descripcion: 'Descripción del proyecto 1',
          estado: statuses[0],
          fecha_inicio: new Date(),
          fecha_entrega: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          cliente: client,
        },
        {
          nombre: `Proyecto 2 - ${client.nombre}`,
          descripcion: 'Descripción del proyecto 2',
          estado: statuses[1],
          fecha_inicio: new Date(),
          fecha_entrega: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
          cliente: client,
        },
        {
          nombre: `Proyecto 3 - ${client.nombre}`,
          descripcion: 'Descripción del proyecto 3',
          estado: statuses[2],
          fecha_inicio: new Date(),
          fecha_entrega: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
          cliente: client,
        },
      ];

      for (const project of projects) {
        const exists = await this.projectRepository.findOne({ 
          where: { 
            nombre: project.nombre,
            cliente: { id: client.id }
          } 
        });
        if (!exists) {
          await this.projectRepository.save(project);
        }
      }
    }
  }
} 