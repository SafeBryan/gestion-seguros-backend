export interface PagoRequestDTO {
  contratoId: number;
  monto: number;
  metodo: string; // ajusta según tu enum o tipo
  comprobante?: string;  // archivo codificado en Base64 (opcional)
  comprobanteTipoContenido?: string; // e.g. 'application/pdf', 'image/png'
  comprobanteNombre?: string;
  estado?: string; // e.g. 'COMPLETADO'
  observaciones?: string;
  fechaPago?: string; // ISO string
}
