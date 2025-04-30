export interface Seguro {
  id?: number;
  nombre: string;
  tipo: 'VIDA' | 'SALUD';
  descripcion: string;
  cobertura: string;
  precioAnual: number;
  activo: boolean;
  creadoPorId?: number;
}
