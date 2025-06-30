import { Injectable } from '@angular/core';

export interface IMenu {
  title: string;
  url?: string;
  icon: string;
  children?: IMenu[];
}

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private adminMenu: IMenu[] = [
    { title: 'Inicio', url: '/home', icon: 'home' },
    { title: 'Usuario', url: '/usuarios', icon: 'person' },
    { title: 'Seguros', url: '/seguros', icon: 'security' },
    { title: 'Contratos', url: '/contratos', icon: 'description' },
    { title: 'Clientes', url: '/clientes', icon: 'people' },
    { title: 'Reembolsos', url: '/reembolsos/pendientes', icon: 'receipt' },
    { title: 'Depositos', url: '/depositos', icon: 'money' },
    {
      title: 'Reportes',
      icon: 'bar_chart',
      children: [
        {
          title: 'Reporte general',
          url: '/reportes/dashboard-reportes',
          icon: 'bar_chart',
        },
        {
          title: 'Seguros Impagos',
          url: '/reportes/seguros-impagos',
          icon: 'payment',
        },
        {
          title: 'Contratos por Cliente',
          url: '/reportes/contratos-por-cliente',
          icon: 'assignment_ind',
        },
        {
          title: 'Reembolsos Pendientes',
          url: '/reportes/reembolsos-pendientes',
          icon: 'pending_actions',
        },
        {
          title: 'Contratos Vencidos',
          url: '/reportes/contratos-vencidos',
          icon: 'event_busy',
        },
        {
          title: 'Contratos por Vencer',
          url: '/reportes/contratos-por-vencer',
          icon: 'event_note',
        },
      ],
    },
  ];

  private clienteMenu: IMenu[] = [
    { title: 'Inicio', url: '/home', icon: 'home' },
    { title: 'Mis Contratos', url: '/contratos', icon: 'assignment' },
        {
      title: 'Realizar Pagos',
      url: '/pagos',
      icon: 'money',
    },
    {
      title: 'Pedir Reembolso',
      url: '/reembolsos/crear',
      icon: 'request_quote',
    },
    { title: 'Mis Reembolsos', url: '/reembolsos', icon: 'receipt_long' },
  ];

  getMenuByRol(rol: string): IMenu[] {
    switch (rol.toUpperCase()) {
      case 'ADMIN':
      case 'AGENTE':
        return JSON.parse(JSON.stringify(this.adminMenu));
      case 'CLIENTE':
        return JSON.parse(JSON.stringify(this.clienteMenu));
      default:
        return [{ title: 'Inicio', url: '/home', icon: 'home' }];
    }
  }
}
