export interface ReembolsoResponse {
  id: number;
  contratoId: number;
  clienteNombre: string;
  seguroNombre: string;
  monto: number;
  descripcion: string;
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
  archivos: { [nombre: string]: string };
  aprobadoPorNombre?: string;
  comentarioRevisor?: string;
  fechaSolicitud: string; // formato ISO string
  fechaRevision?: string;
}
