import { Component, inject, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { IMenu, MenuService } from '../../core/services/menu.service';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    MatListModule,
    RouterModule,
    MatButtonModule,
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent implements OnInit {
  listMenu: IMenu[] = [];
  private menuSrv = inject(MenuService);

  ngOnInit(): void {
    const usuarioStr = localStorage.getItem('UserProfile');

    if (!usuarioStr) {
      this.listMenu = [];
      return;
    }

    const usuario = JSON.parse(usuarioStr);
    const rawRol = usuario?.roles?.[0] ?? 'ROLE_INVITADO';
    const rol = rawRol.replace('ROLE_', '');

    this.listMenu = this.menuSrv.getMenuByRol(rol);
  }
}
