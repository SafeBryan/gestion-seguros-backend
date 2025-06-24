import { Seguro } from './seguro.model';
import { Usuario } from './usuario.model';

export interface Beneficiario {
  nombre: string;
  tipoIdentificacion: 'CEDULA' | 'PASAPORTE';
  numeroIdentificacion: string;
  fechaNacimiento: string;
  nacionalidad: string;
  parentesco: string;
  porcentaje: number;
  estatura: string; // Formato: '1.75' (metros)
  peso: string; // Formato: '70' (kg o lb)
  lugarNacimiento: string;
  documentoIdentidad?: string;
  email?: string;
  telefono?: string;
  esPrincipal?: boolean;
}

export type FrecuenciaPago = 'MENSUAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL';
export type EstadoContrato = 'PENDIENTE' | 'ACTIVO' | 'VENCIDO' | 'CANCELADO'  | 'ACEPTADO';

export interface Dependiente {
  nombre: string;
  tipoIdentificacion: 'CEDULA' | 'PASAPORTE';
  numeroIdentificacion: string;
  fechaNacimiento: string;
  nacionalidad: string;
  parentesco: string;
  estatura: string; // Formato: '1.75' (metros)
  peso: string; // Formato: '70' (kg o lb)
  lugarNacimiento: string;
  tieneDiscapacidad: boolean;
  diagnosticoDiscapacidad?: string;
  hospitalCobertura: string;
}

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
  dependientes: Dependiente[];

  seguro?: Seguro;
  agente?: Usuario;
}
