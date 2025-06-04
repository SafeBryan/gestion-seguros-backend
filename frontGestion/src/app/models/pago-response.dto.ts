export interface PagoResponseDTO {
  id: number;
  contratoId: number;
  contratoReferencia?: string;
  clienteNombre?: string;
  monto: number;
  fechaPago: string;
  metodo: string;
  referencia?: string;
  comprobante?: string;
  estado: string;
  observaciones?: string;
}
