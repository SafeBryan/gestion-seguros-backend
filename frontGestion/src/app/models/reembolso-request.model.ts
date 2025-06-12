export interface ReembolsoRequest {
  contratoId: number;
  monto: number;
  descripcion: string;
  archivos: { [nombre: string]: string }; // base64 o URL temporal
}
