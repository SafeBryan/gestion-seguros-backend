import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './guards/auth.guard';
import { SegurosComponent } from './pages/seguros/seguros.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { ContratosListComponent } from './pages/contratos/contratos-list/contratos-list.component';
import { ContratosPageComponent } from './pages/contratos/contratos-page/contratos-page.component';
import { ClientesListComponent } from './pages/clientes/clientes-list/clientes-list.component';
import { ReembolsoCrearComponent } from './pages/reembolsos/reembolso-crear/reembolso-crear.component';
import { ReembolsoHistorialComponent } from './pages/reembolsos/reembolso-historial/reembolso-historial.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [authGuard],
  },
  {
    path: 'seguros',
    component: SegurosComponent,
    canActivate: [authGuard],
  },
  {
    path: 'contratos',
    component: ContratosPageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'clientes',
    component: ClientesListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'reembolsos/crear',
    component: ReembolsoCrearComponent,
    canActivate: [authGuard],
  },
  {
    path: 'reembolsos',
    component: ReembolsoHistorialComponent,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
