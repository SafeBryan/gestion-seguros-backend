import { Injectable } from '@angular/core';

export interface IMenu {
  title: string;
  url: string;
  icon: string;
}

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private listMenu: IMenu[] = [
    
    { title: 'Inicio', url: '/home', icon: 'home' },
    { title: 'Usuario', url: '/usuarios', icon: 'person' }, // Cambio de 'user' a 'person'
    { title: 'Seguros', url: '/seguros', icon: 'security' }, // Cambio de 'seguro' a 'security'
    { title: 'Contratos', url: '/contratos', icon: 'description' }, // Cambio de 'contrato' a 'description'
    { title: 'Clientes', url: '/clientes', icon: 'description' }, // Cambio de 'contrato' a 'description'
    { title: 'Pagos', url: '/pagos', icon: 'money' }, // Cambio de 'contrato' a 'description'
  ];

  constructor() {}

  getMenu() {
    return [...this.listMenu];
  }

  getMenuByUrl(url: string): IMenu {
    return this.listMenu.find(
      (menu) => menu.url.toLowerCase() === url.toLocaleLowerCase()
    ) as IMenu;
  }
}
