import { Seguro } from './seguro.model';
import { Usuario } from './usuario.model';

export interface Beneficiario {
  nombre: string;
  parentesco: string;
  porcentaje: number;
  documentoIdentidad?: string;
  email?: string;
  telefono?: string;
  fechaNacimiento?: string;
  esPrincipal?: boolean;
}

export type FrecuenciaPago = 'MENSUAL' | 'TRIMESTRAL' | 'ANUAL';
export type EstadoContrato = 'ACTIVO' | 'VENCIDO' | 'CANCELADO';

export interface Contrato {
  id?: number;
  clienteId: number;
  seguroId?: number;
  agenteId?: number;
  fechaInicio: string; // formato 'yyyy-MM-dd'
  fechaFin: string;
  frecuenciaPago: FrecuenciaPago;
  estado?: EstadoContrato;
  firmaElectronica?: string;
  archivos?: { [nombre: string]: string }; // Ej: {'cedula.pdf': 'base64string'}
  beneficiarios: Beneficiario[];

  seguro?: Seguro;
  agente?: Usuario;
}
