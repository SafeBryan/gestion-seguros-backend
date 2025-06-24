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
  comprobanteTipoContenido?: string;    
  estado: 'COMPLETADO' | 'REVERTIDO' | string;
  observaciones?: string;
}
