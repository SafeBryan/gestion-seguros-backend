export interface PagoRequestDTO {
  contratoId: number;
  metodo: string;
  monto: number;
  referencia?: string;
  comprobante?: string;
  observaciones?: string;
}
