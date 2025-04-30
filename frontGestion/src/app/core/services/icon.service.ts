import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

interface IIcon {

  name: string;
  path: string;
}

@Injectable({
  providedIn: 'root'
})
export class IconService {
  private icons: IIcon[] = [
    { name: 'user', path: 'assets/icons/user.svg' },
    { name: 'seguro', path: 'assets/icons/seguro.svg' }
  ];

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.registerIcons();
  }

  private registerIcons() {
    this.icons.forEach(icon => {
      this.matIconRegistry.addSvgIcon(
        icon.name,
        this.domSanitizer.bypassSecurityTrustResourceUrl(icon.path)
      );
    });
  }

  getIcon() {
    return [...this.icons];
  }

  getIconByName(name: string): IIcon {
    return this.icons.find(
      icon => icon.name.toLowerCase() === name.toLowerCase()
    ) as IIcon;
  }
}
