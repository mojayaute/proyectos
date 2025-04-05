import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async create(createClientDto: Partial<Client>): Promise<Client> {
    const client = this.clientsRepository.create(createClientDto);
    return this.clientsRepository.save(client);
  }

  async findAll(userId: number): Promise<Client[]> {
    return this.clientsRepository.find({ where: { user: { id: userId } } });
  }

  async findOne(id: number, userId: number): Promise<Client> {
    return this.clientsRepository.findOne({
      where: { id, user: { id: userId } },
    });
  }

  async update(id: number, updateClientDto: Partial<Client>, userId: number): Promise<Client> {
    await this.clientsRepository.update(
      { id, user: { id: userId } },
      updateClientDto,
    );
    return this.findOne(id, userId);
  }

  async remove(id: number, userId: number): Promise<void> {
    await this.clientsRepository.delete({ id, user: { id: userId } });
  }
} 