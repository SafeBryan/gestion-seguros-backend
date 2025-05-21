import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {
  UsuarioService,
  RegistroDTO,
} from '../../core/services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { RolService } from '../../core/services/rol.service';
import { Rol } from '../../models/rol.model';

// Angular Material Imports
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    NgIf,
    NgFor,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit, AfterViewInit {
  // Propiedades de datos
  usuarios: Usuario[] = [];
  roles: Rol[] = [];
  dataSource = new MatTableDataSource<Usuario>([]);
  columnas: string[] = [
    'id',
    'nombre',
    'apellido',
    'email',
    'telefono',
    'rolNombre',
    'activo',
    'acciones',
  ];

  // Estado UI
  loading = true;
  modoEdicion = false;
  usuarioEditando: Usuario | null = null;
  hidePassword = true;

  // Form data
  nuevoUsuario: RegistroDTO = {
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    telefono: '',
    rolId: 0,
  };

  // Referencias a elementos del DOM
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;

  constructor(
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarRoles();
  }

  ngAfterViewInit() {
    // Configurar paginador y ordenamiento después de que las vistas se inicialicen
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  cargarRoles(): void {
    this.rolService.obtenerTodos().subscribe({
      next: (data) => {
        this.roles = data;
      },
      error: (err) => {
        console.error('Error al cargar roles', err);
        this.mostrarNotificacion('Error al cargar roles', 'error');
      },
    });
  }

  cargarUsuarios(): void {
    this.loading = true;
    this.usuarioService.obtenerTodos().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.dataSource = new MatTableDataSource<Usuario>(this.usuarios);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios', err);
        this.loading = false;
        this.mostrarNotificacion('Error al cargar usuarios', 'error');
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

  trackByUsuarioId(index: number, usuario: Usuario): number {
    return usuario.id!;
  }

  crearUsuario(): void {
    this.modoEdicion = false;
    this.usuarioEditando = null;
    this.hidePassword = true;
    this.nuevoUsuario = {
      email: '',
      password: '',
      nombre: '',
      apellido: '',
      telefono: '',
      rolId: 0,
    };

    this.abrirDialog();
  }

  editarUsuario(usuario: Usuario): void {
    this.modoEdicion = true;
    this.usuarioEditando = usuario;
    this.hidePassword = true;

    // Crear un objeto que cumpla con la estructura RegistroDTO para el formulario
    this.nuevoUsuario = {
      email: usuario.email,
      password: '', // Generalmente no se rellena la contraseña en edición
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      telefono: usuario.telefono || '',
      rolId: usuario.rolId,
    };

    this.abrirDialog();
  }

  abrirDialog(): void {
    const dialogRef = this.dialog.open(this.dialogTemplate, {
      width: '600px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'save') {
        this.guardarUsuario();
      }
    });
  }

  guardarUsuario(): void {
    if (this.modoEdicion && this.usuarioEditando) {
      this.loading = true;
      this.usuarioService
        .editar(this.usuarioEditando.id!, this.nuevoUsuario)
        .subscribe({
          next: () => {
            this.loading = false;
            this.cargarUsuarios();
            this.dialog.closeAll();
            this.mostrarNotificacion(
              'Usuario editado correctamente',
              'success'
            );
          },
          error: () => {
            this.loading = false;
            this.mostrarNotificacion('Error al editar usuario', 'error');
          },
        });
    } else {
      this.loading = true;
      this.usuarioService.crear(this.nuevoUsuario).subscribe({
        next: () => {
          this.loading = false;
          this.cargarUsuarios();
          this.dialog.closeAll();
          this.mostrarNotificacion('Usuario creado correctamente', 'success');
        },
        error: () => {
          this.loading = false;
          this.mostrarNotificacion('Error al crear usuario', 'error');
        },
      });
    }
  }

  eliminarUsuario(usuario: Usuario): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmar eliminación',
        message: `¿Estás seguro de eliminar al usuario ${usuario.nombre} ${usuario.apellido}?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.usuarioService.eliminar(usuario.id!).subscribe({
          next: () => {
            this.cargarUsuarios();
            this.mostrarNotificacion(
              'Usuario eliminado correctamente',
              'success'
            );
          },
          error: (err) => {
            console.error('Error al eliminar usuario', err);
            this.mostrarNotificacion('Error al eliminar usuario', 'error');
          },
        });
      }
    });
  }

  getRoleClass(rolNombre: string): string {
    if (!rolNombre) return 'role-default';

    const rolLower = rolNombre.toLowerCase();
    if (rolLower.includes('admin')) return 'role-admin';
    if (rolLower.includes('medic')) return 'role-medico';
    if (rolLower.includes('usuario')) return 'role-usuario';
    return 'role-default';
  }

  mostrarNotificacion(
    mensaje: string,
    tipo: 'success' | 'error' | 'info'
  ): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: tipo === 'error' ? ['error-snackbar'] : ['success-snackbar'],
    });
  }
}

// Importar el componente de diálogo de confirmación
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
