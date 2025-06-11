import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Contrato, EstadoContrato } from '../../../models/contrato.model';
import { ContratoService } from '../../../core/services/contrato.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

// Material imports
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-contratos-list',
  standalone: true,
  templateUrl: './contratos-list.component.html',
  styleUrls: ['./contratos-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatSnackBarModule,
    MatDialogModule,
    MatSelectModule,
    MatDivider
  ],
})
export class ContratosListComponent implements OnInit {
  contratos: Contrato[] = [];
  contratosFiltrados: Contrato[] = [];
  loading = false;
  contratoActivoParaFirmar: Contrato | null = null;
  mostrarModalFirma: boolean = false;
  aceptando: boolean = false;
  rechazando: boolean = false;
  fechaFirma: string = '';
  motivoRechazo: string = '';
  esAdmin: boolean = false;
  esCliente: boolean = false;
  displayedColumns: string[] = [
    'id',
    'seguro',
    'fechaInicio',
    'fechaFin',
    'estado',
    'acciones',
  ];
  expandedContrato: Contrato | null = null;
  filtroEstado: string = 'TODOS';

  // Estados disponibles para filtrar
  estadosDisponibles: string[] = [
    'TODOS',
    'ACTIVO',
    'PENDIENTE',
    'VENCIDO',
    'CANCELADO',
  ];

  @Output() editar = new EventEmitter<Contrato>();

  constructor(
    private contratoService: ContratoService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    const perfil = this.authService.getUsuarioPerfil();
    const roles: string[] = perfil && Array.isArray((perfil as any).roles) ? (perfil as any).roles : [];
    this.esCliente = roles.includes('ROLE_CLIENTE');
    this.esAdmin = roles.includes('ROLE_ADMIN');
    console.log("Perfil:",perfil)
    
    console.log("Admin:",this.esAdmin)
    console.log("Cliente:",this.esCliente)
  }

  ngOnInit(): void {
    this.cargarContratos();
  }

  cargarContratos(): void {
    this.loading = true;

    const obs = this.esCliente
      ? this.contratoService.obtenerPorCliente(this.authService.getUsuarioId())
      : this.contratoService.obtenerTodosLosContratos();
    obs.subscribe({
      next: (data) => {
        this.contratos = data;
        this.normalizarEstadosContratos();
        this.filtroEstado = 'TODOS';
        this.aplicarFiltro();
        this.verificarContratosVencidos();
        this.loading = false;
        // Buscar contrato ACTIVO para firma
        if (this.esCliente) {
          const contratoActivo = this.contratos.find(c => c.estado === 'ACTIVO');
          if (contratoActivo) {
            this.contratoActivoParaFirmar = contratoActivo;
            this.mostrarModalFirma = true;
          } else {
            this.mostrarModalFirma = false;
            this.contratoActivoParaFirmar = null;
          }
        }
      },
      error: (err) => {
        this.snackBar.open('Error al cargar los contratos', 'Cerrar', { duration: 3000 });
        this.loading = false;
      },
    });
  }

  cargarContratosPorId(){
    
  }

  // Método para normalizar los estados de todos los contratos
  normalizarEstadosContratos(): void {
    this.contratos.forEach((contrato) => {
      if (!contrato.estado) {
        console.log(
          `Contrato ${contrato.id} no tiene estado, asignando ACTIVO por defecto`
        );
        contrato.estado = 'ACTIVO';
      } else {
        // Convertir a mayúsculas y normalizar los estados
        const estadoNormalizado = this.normalizarEstado(contrato.estado);
        if (contrato.estado !== estadoNormalizado) {
          console.log(
            `Normalizando estado: ${contrato.estado} -> ${estadoNormalizado}`
          );
          contrato.estado = estadoNormalizado as EstadoContrato;
        }
      }
    });
  }

  // Método para normalizar un estado
  normalizarEstado(estado: string): string {
    if (!estado) return 'ACTIVO'; // Estado por defecto si no existe

    // Convertir a mayúsculas y eliminar espacios
    const estadoLimpio = estado.toUpperCase().trim();

    // Mapear posibles variaciones a los estados estándar
    const mapa: { [key: string]: string } = {
      ACTIVO: 'ACTIVO',
      ACTIVOS: 'ACTIVO',
      ACTIVE: 'ACTIVO',

      PENDIENTE: 'PENDIENTE',
      PENDIENTES: 'PENDIENTE',
      PENDING: 'PENDIENTE',

      VENCIDO: 'VENCIDO',
      VENCIDOS: 'VENCIDO',
      EXPIRED: 'VENCIDO',

      CANCELADO: 'CANCELADO',
      CANCELADOS: 'CANCELADO',
      CANCELED: 'CANCELADO',
      CANCELLED: 'CANCELADO',
    };

    return mapa[estadoLimpio] || estadoLimpio;
  }

  // Método para aplicar filtros por estado
  aplicarFiltro(): void {
    console.log('Aplicando filtro:', this.filtroEstado);
    console.log('Total de contratos antes de filtrar:', this.contratos.length);
    console.log('Estados disponibles:', [
      ...new Set(this.contratos.map((c) => c.estado)),
    ]);

    if (this.filtroEstado === 'TODOS') {
      this.contratosFiltrados = [...this.contratos];
      console.log(
        'Mostrando todos los contratos:',
        this.contratosFiltrados.length
      );
    } else {
      // Filtrar por estado exacto (ya normalizado)
      this.contratosFiltrados = this.contratos.filter(
        (c) => c.estado === this.filtroEstado
      );
      console.log(
        `Contratos con estado "${this.filtroEstado}":`,
        this.contratosFiltrados.length
      );
    }

    // Si no hay contratos filtrados y hay contratos disponibles, mostrar mensaje
    if (this.contratosFiltrados.length === 0 && this.contratos.length > 0) {
      console.warn(
        `No hay contratos que coincidan con el filtro "${this.filtroEstado}"`
      );
    }
  }

  // Método para cambiar el filtro de estado
  cambiarFiltroEstado(filtro: string): void {
    console.log('Cambiando filtro a:', filtro);
    this.filtroEstado = filtro;
    this.aplicarFiltro();
  }

  // Método para verificar si hay contratos vencidos (fechaFin < fecha actual)
  verificarContratosVencidos(): void {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Establecer a inicio del día

    // Verifica si hay contratos que estén vencidos pero no tengan el estado VENCIDO
    let contratosModificados = false;

    this.contratos.forEach((contrato) => {
      if (contrato.estado !== 'CANCELADO' && contrato.estado !== 'VENCIDO') {
        const fechaFin = new Date(contrato.fechaFin);
        fechaFin.setHours(0, 0, 0, 0);

        if (fechaFin < hoy) {
          console.log(
            `Contrato ${contrato.id} está vencido: ${fechaFin} < ${hoy}`
          );
          this.actualizarEstadoVencido(contrato);
          contratosModificados = true;
        }
      }
    });

    // Si se modificaron contratos, volver a aplicar el filtro
    if (contratosModificados) {
      setTimeout(() => this.aplicarFiltro(), 500);
    }
  }

  // Método para actualizar el estado de un contrato a VENCIDO
  actualizarEstadoVencido(contrato: Contrato): void {
    if (!contrato?.id) return;

    console.log(`Actualizando contrato ${contrato.id} a estado VENCIDO`);

    this.contratoService.actualizarEstado(contrato.id, 'VENCIDO').subscribe({
      next: (contratoActualizado) => {
        console.log(`Contrato ${contrato.id} actualizado a VENCIDO con éxito`);
        // Actualizar el contrato en la lista local
        contrato.estado = 'VENCIDO';
        // Volver a aplicar el filtro después de la actualización
        this.aplicarFiltro();
      },
      error: (err) => {
        console.error(
          `Error al actualizar estado del contrato ${contrato.id}`,
          err
        );
      },
    });
  }

  desactivarContrato(contrato: Contrato): void {
    if (!contrato?.id) return;

    // Confirmación antes de desactivar
    const confirmar = confirm(
      `¿Está seguro que desea cancelar el contrato #${contrato.id}?`
    );
    if (!confirmar) return;

    this.loading = true;
    this.contratoService.actualizarEstado(contrato.id, 'CANCELADO').subscribe({
      next: () => {
        this.snackBar.open('Contrato cancelado exitosamente', 'Cerrar', {
          duration: 3000,
        });
        // Actualizar el estado en la lista local en lugar de recargar todos
        const index = this.contratos.findIndex((c) => c.id === contrato.id);
        if (index >= 0) {
          this.contratos[index].estado = 'CANCELADO';
          // Volver a aplicar el filtro después de la actualización
          this.aplicarFiltro();
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al desactivar contrato', err);
        this.snackBar.open('Error al cancelar el contrato', 'Cerrar', {
          duration: 3000,
        });
        this.loading = false;
      },
    });
  }

  editarContrato(contrato: Contrato): void {
    if ((contrato.estado as string) === 'ACEPTADO' || (contrato.estado as string) === 'RECHAZADO') return;
    this.editar.emit({ ...contrato });
  }

  aceptarContrato(): void {
    if (!this.contratoActivoParaFirmar?.id) return;
    
    this.aceptando = true;
    
    this.contratoService.actualizarEstado(this.contratoActivoParaFirmar.id, 'ACEPTADO').subscribe({
      next: (contrato) => {
        this.snackBar.open('Contrato aceptado exitosamente', 'Cerrar', { duration: 3000 });
        this.aceptando = false;
        this.mostrarModalFirma = false;
        this.cargarContratos();
      },
      error: (err) => {
        console.error('Error al aceptar el contrato:', err);
        this.snackBar.open('Error al aceptar el contrato', 'Cerrar', { duration: 3000 });
        this.aceptando = false;
      }
    });
  }
  
  rechazarContrato(): void {
    if (!this.contratoActivoParaFirmar?.id) return;
    
    this.rechazando = true;
    
    this.contratoService.actualizarEstado(this.contratoActivoParaFirmar.id, 'RECHAZADO').subscribe({
      next: (contrato) => {
        this.snackBar.open('Contrato rechazado', 'Cerrar', { duration: 3000 });
        this.rechazando = false;
        this.mostrarModalFirma = false;
        this.cargarContratos();
      },
      error: (err) => {
        console.error('Error al rechazar el contrato:', err);
        this.snackBar.open('Error al rechazar el contrato', 'Cerrar', { duration: 3000 });
        this.rechazando = false;
      }
    });
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'ACTIVO':
        return 'primary'; // Azul
      case 'PENDIENTE':
        return 'accent'; // Naranja/Ámbar
      case 'VENCIDO':
        return 'warn'; // Rojo, diferente a CANCELADO para distinguirlos visualmente
      case 'CANCELADO':
        return 'warn'; // Rojo
      default:
        return '';
    }
  }

  getFrecuenciaPagoTexto(frecuencia: string): string {
    switch (frecuencia) {
      case 'MENSUAL':
        return 'Mensual';
      case 'TRIMESTRAL':
        return 'Trimestral';
      case 'SEMESTRAL':
        return 'Semestral';
      case 'ANUAL':
        return 'Anual';
      default:
        return frecuencia;
    }
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Methods to handle row expansion for beneficiaries
  expandRow(contrato: Contrato): void {
    this.expandedContrato =
      this.expandedContrato === contrato ? null : contrato;
  }

  isExpanded(contrato: Contrato): boolean {
    return this.expandedContrato === contrato;
  }
  isExpandable = (index: number, row: any) => {
    return row.detalles && row.detalles.length > 0;
  };
}
