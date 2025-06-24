import { Contrato } from './contrato.model';
import { ClienteResponseDTO } from './cliente-response.dto';
import { PagoResponseDTO } from './pago-response.dto';

export interface ClienteConPagos {
  cliente: ClienteResponseDTO;
  pagos: PagoResponseDTO[];
}

export interface ContratoConClientes {
  contrato: Contrato;
  clientes: ClienteConPagos[];
}
