import { Routes } from "@angular/router";
import { SegurosImpagosComponent } from "./seguros-impagos/seguros-impagos.component";
import { ContratosPorClienteComponent } from "./contratos-por-cliente/contratos-por-cliente.component";
import { ReembolsosPendientesComponent } from "./reembolsos-pendientes/reembolsos-pendientes.component";
import { ContratosVencidosComponent } from "./contratos-vencidos/contratos-vencidos.component";
import { ContratosPorVencerComponent } from "./contratos-por-vencer/contratos-por-vencer.component";
import { DashboardReportesComponent } from "./dashboard-reportes/dashboard-reportes.component";

const reportesRoutes: Routes = [
    {
        path: 'dashboard-reportes',
        component: DashboardReportesComponent
    },
    {
        path: 'seguros-impagos',
        component: SegurosImpagosComponent
    },
    {
        path: 'contratos-por-cliente',
        component: ContratosPorClienteComponent
    },
    {
        path: 'reembolsos-pendientes',
        component: ReembolsosPendientesComponent
    },
    {
        path: 'contratos-vencidos',
        component: ContratosVencidosComponent
    },
    {
        path: 'contratos-por-vencer',
        component: ContratosPorVencerComponent
    },
    {
        path: '',
        redirectTo: 'dashboard-reportes',
        pathMatch: 'full'
    }
]

export default reportesRoutes