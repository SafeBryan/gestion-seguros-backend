import { Injectable } from '@angular/core';

interface IIcon {
  name: string;
  path: string;
}

@Injectable({
  providedIn: 'root'
})
export class IconService {
  private icons: IIcon[] = [
    {name: 'home', path: 'assets/icons/logo.svg'},       // Quita la barra inicial '/'
    {name: 'user', path: 'assets/icons/agent.svg'},      // Quita la barra inicial '/'
    {name: 'seguro', path: 'assets/icons/client.svg'},   // Quita la barra inicial '/'
    {name: 'contrato', path: 'assets/icons/contact.svg'} // Quita la barra inicial '/'
  ];

  constructor() {}

  getIcon() {
    return [...this.icons];
  }

  getIconByName(name: string): IIcon {
    return this.icons.find(icon => icon.name.toLowerCase() === name.toLowerCase()) as IIcon;
  }
}