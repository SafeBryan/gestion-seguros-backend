import { Injectable } from '@angular/core';

export interface IMenu {
  title: string;
  url: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private listMenu: IMenu[] = [
    { title: 'Inicio', url: '/home', icon: 'home' },
    { title: 'Usuario', url: '/usuarios', icon: 'user' },
    { title: 'Seguros', url: '/seguros', icon: 'seguro' },
    
  ];

  constructor() { }

  getMenu() {
    return [...this.listMenu];
  }

  getMenuByUrl(url: string): IMenu {
    return this.listMenu.find(
      (menu) => menu.url.toLowerCase() === url.toLowerCase()
    ) as IMenu;
  }

}
