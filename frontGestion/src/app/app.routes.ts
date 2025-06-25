import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './guards/auth.guard';
import { SegurosComponent } from './pages/seguros/seguros.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { ContratosPageComponent } from './pages/contratos/contratos-page/contratos-page.component';
import { ClientesListComponent } from './pages/clientes/clientes-list/clientes-list.component';
import { ReembolsoCrearComponent } from './pages/reembolsos/reembolso-crear/reembolso-crear.component';
import { ReembolsoHistorialComponent } from './pages/reembolsos/reembolso-historial/reembolso-historial.component';
import { ReembolsosPendientesComponent } from './pages/reembolsos/reembolsos-pendientes/reembolsos-pendientes.component';

// Importa el componente de reportes
import { SegurosImpagosComponent } from './pages/reportes/seguros-impagos/seguros-impagos.component';
import { PagoComponent } from './pages/pago/pago.component';
import { AcceptedContractsComponent } from './pages/accepted-contracts/accepted-contracts.component';
import { ContractsClientsPaymentsComponent } from './pages/contract-client-payments/contract-client-payments.component';

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
    path: 'pagos',
    component: AcceptedContractsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'depositos',
    component: ContractsClientsPaymentsComponent,
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
    path: 'reembolsos/pendientes',
    component: ReembolsosPendientesComponent,
    canActivate: [authGuard],
  },
  {
    path: 'reportes',
    loadChildren: () => import('./pages/reportes/reportes.routes'),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'login',
  },



];
