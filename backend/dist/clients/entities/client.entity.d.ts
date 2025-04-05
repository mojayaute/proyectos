import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';
export declare class Client {
    id: number;
    nombre: string;
    correo: string;
    telefono: string;
    user: User;
    projects: Project[];
}
