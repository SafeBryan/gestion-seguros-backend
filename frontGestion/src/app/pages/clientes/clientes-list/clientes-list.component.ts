import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteResponseDTO } from '../../../models/cliente-response.dto';
import { ClienteService } from '../../../core/services/cliente.service';
import { ClientesFormComponent } from '../clientes-form/clientes-form.component';

// Angular Material Imports
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-clientes-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './clientes-list.component.html',
  styleUrls: ['./clientes-list.component.css'],
})
export class ClientesListComponent implements OnInit, AfterViewInit {
  // Propiedades de datos
  clientes: ClienteResponseDTO[] = [];
  dataSource = new MatTableDataSource<ClienteResponseDTO>([]);
  columnas: string[] = [
    'id',
    'nombre',
    'email',
    'identificacion',
    'fechaNacimiento',
    'estadoCivil',
    'sexo',
    'telefono',
    'acciones',
  ];

  // Estado UI
  loading = true;

  // Referencias a elementos del DOM
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private clienteService: ClienteService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  ngAfterViewInit() {
    // Configurar paginador y ordenamiento después de que las vistas se inicialicen
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  cargarClientes(): void {
    this.loading = true;
    this.clienteService.listarClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.dataSource = new MatTableDataSource<ClienteResponseDTO>(this.clientes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
        this.loading = false;
        this.mostrarNotificacion('Error al cargar clientes', 'error');
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  trackByClienteId(index: number, cliente: ClienteResponseDTO): number {
    return cliente.id;
  }

  crearCliente(): void {
    const dialogRef = this.dialog.open(ClientesFormComponent, {
      width: '700px',
      disableClose: true,
      data: null,
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado === 'guardado') {
        this.cargarClientes();
        this.mostrarNotificacion('Cliente creado correctamente', 'success');
      }
    });
  }

  editarCliente(cliente: ClienteResponseDTO): void {
    const dialogRef = this.dialog.open(ClientesFormComponent, {
      width: '700px',
      disableClose: true,
      data: { clienteId: cliente.id },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado === 'guardado') {
        this.cargarClientes();
        this.mostrarNotificacion('Cliente editado correctamente', 'success');
      }
    });
  }

  desactivarCliente(cliente: ClienteResponseDTO): void {
    // Aquí podrías usar un dialog de confirmación como en usuarios
    if (confirm(`¿Está seguro de desactivar al cliente ${cliente.nombre} ${cliente.apellido}?`)) {
      this.clienteService.desactivarCliente(cliente.id).subscribe({
        next: () => {
          this.cargarClientes();
          this.mostrarNotificacion('Cliente desactivado correctamente', 'success');
        },
        error: (err) => {
          console.error('Error al desactivar cliente:', err);
          this.mostrarNotificacion('Error al desactivar cliente', 'error');
        },
      });
    }
  }

  getEstadoCivilClass(estadoCivil: string): string {
    if (!estadoCivil) return 'estado-default';

    const estadoLower = estadoCivil.toLowerCase();
    if (estadoLower.includes('soltero')) return 'estado-soltero';
    if (estadoLower.includes('casado')) return 'estado-casado';
    if (estadoLower.includes('divorciado')) return 'estado-divorciado';
    if (estadoLower.includes('viudo')) return 'estado-viudo';
    return 'estado-default';
  }

  getSexoClass(sexo: string): string {
    if (!sexo) return 'sexo-default';
    
    const sexoLower = sexo.toLowerCase();
    if (sexoLower.includes('masculino')) return 'sexo-masculino';
    if (sexoLower.includes('femenino')) return 'sexo-femenino';
    return 'sexo-default';
  }

  calcularEdad(fechaNacimiento: string): number {
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    
    return edad;
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return 'No especificada';
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES');
  }

  mostrarNotificacion(mensaje: string, tipo: 'success' | 'error' | 'info'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: tipo === 'error' ? ['error-snackbar'] : ['success-snackbar'],
    });
  }
}