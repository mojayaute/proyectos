import { Client } from '../../clients/entities/client.entity';
export declare enum ProjectStatus {
    PENDIENTE = "pendiente",
    EN_PROGRESO = "en progreso",
    COMPLETADO = "completado"
}
export declare class Project {
    id: number;
    nombre: string;
    descripcion: string;
    estado: ProjectStatus;
    fecha_inicio: Date;
    fecha_entrega: Date;
    cliente: Client;
}
