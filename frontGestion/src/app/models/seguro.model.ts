export interface Seguro {
  id: number; // ← ya no es opcional
  nombre: string;
  tipo: 'VIDA' | 'SALUD';
  descripcion: string;
  cobertura: string;
  precioAnual: number;
  activo: boolean;
  creadoPorId?: number; 
}
