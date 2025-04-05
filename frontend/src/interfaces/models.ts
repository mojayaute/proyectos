// Interfaces para los modelos de la aplicación

export interface User {
  id: number;
  email: string;
}

export interface Client {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
  user?: User;
}

export enum ProjectStatus {
  PENDIENTE = 'pendiente',
  EN_PROGRESO = 'en progreso',
  COMPLETADO = 'completado',
}

export interface Project {
  id: number;
  nombre: string;
  descripcion: string;
  estado: ProjectStatus;
  fecha_inicio: string;
  fecha_entrega: string;
  cliente?: Client;
}

// Interfaces para los formularios
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
}

export interface ClientFormData {
  nombre: string;
  correo: string;
  telefono: string;
}

export interface ProjectFormData {
  nombre: string;
  descripcion: string;
  estado: ProjectStatus;
  fecha_inicio: string;
  fecha_entrega: string;
} 