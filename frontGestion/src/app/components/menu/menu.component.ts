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
    MatIconModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  listMenu: IMenu[];
  
  private menuSrv = inject(MenuService);
  
  constructor() {
    this.listMenu = this.menuSrv.getMenu();
  }
  
  ngOnInit(): void {
    // Ya no necesitamos registrar SVGs personalizados
  }
}