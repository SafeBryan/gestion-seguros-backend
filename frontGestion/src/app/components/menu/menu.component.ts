import { Component, inject } from '@angular/core';
import {MatListModule} from '@angular/material/list';
import { IMenu, MenuService } from '../../core/services/menu.service';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { IconService } from '../../core/services/icon.service';


@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MatListModule, RouterModule, MatButtonModule,CommonModule,
    MatIconModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  listMenu:IMenu[];

  menuSrv= inject(MenuService);
  matRegistry = inject(MatIconRegistry);
  domSanitizer = inject(DomSanitizer);
  iconSrv = inject(IconService);

  constructor() {
    this.listMenu = this.menuSrv.getMenu()
      
    this.iconSrv.getIcon().forEach(icon => {
      this.matRegistry.addSvgIcon(
        icon.name,
        this.domSanitizer.bypassSecurityTrustResourceUrl(icon.path)
      );
    });
    
    }

  
}
