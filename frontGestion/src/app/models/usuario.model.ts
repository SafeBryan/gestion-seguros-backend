export interface Usuario {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  rolId: number;
  rolNombre?: string;
  activo: boolean;
  fechaCreacion?: Date;
}