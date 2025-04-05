"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeederService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const client_entity_1 = require("../clients/entities/client.entity");
const project_entity_1 = require("../projects/entities/project.entity");
const bcrypt = require("bcrypt");
let SeederService = class SeederService {
    constructor(userRepository, clientRepository, projectRepository) {
        this.userRepository = userRepository;
        this.clientRepository = clientRepository;
        this.projectRepository = projectRepository;
    }
    async seed() {
        await this.seedUsers();
        await this.seedClients();
        await this.seedProjects();
    }
    async seedUsers() {
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
    async seedClients() {
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
    async seedProjects() {
        const clients = await this.clientRepository.find({ relations: ['user'] });
        const statuses = Object.values(project_entity_1.ProjectStatus);
        for (const client of clients) {
            const projects = [
                {
                    nombre: `Proyecto 1 - ${client.nombre}`,
                    descripcion: 'Descripción del proyecto 1',
                    estado: statuses[0],
                    fecha_inicio: new Date(),
                    fecha_entrega: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    cliente: client,
                },
                {
                    nombre: `Proyecto 2 - ${client.nombre}`,
                    descripcion: 'Descripción del proyecto 2',
                    estado: statuses[1],
                    fecha_inicio: new Date(),
                    fecha_entrega: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
                    cliente: client,
                },
                {
                    nombre: `Proyecto 3 - ${client.nombre}`,
                    descripcion: 'Descripción del proyecto 3',
                    estado: statuses[2],
                    fecha_inicio: new Date(),
                    fecha_entrega: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
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
};
exports.SeederService = SeederService;
exports.SeederService = SeederService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(client_entity_1.Client)),
    __param(2, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SeederService);
//# sourceMappingURL=seeder.service.js.map