import { Component, inject } from '@angular/core';
import {
  MatSidenavModule,
  MatDrawerContainer,
  MatDrawer,
  MatDrawerContent,
} from '@angular/material/sidenav';
import { RouterOutlet, Router } from '@angular/router';
import { MenuComponent } from '../app/components/menu/menu.component';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './shared/components/header/header.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatIconModule,
    HttpClientModule,
    FormsModule,
    MatDrawerContainer,
    MatDrawer,
    MatDrawerContent,
    MenuComponent,
    HeaderComponent,
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  isSidenavOpen = true;
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoggedIn = this.authService.isLoggedIn();

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  isLoginRoute(): boolean {
    return this.router.url === '/login';
  }

  title = 'Gestion de Seguros';
}
