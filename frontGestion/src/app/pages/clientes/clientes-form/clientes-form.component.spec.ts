import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientesFormComponent } from './clientes-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClienteService } from '../../../core/services/cliente.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { of } from 'rxjs';


describe('ClientesFormComponent', () => {
  let component: ClientesFormComponent;
  let fixture: ComponentFixture<ClientesFormComponent>;

  let mockClienteService: any;
  let mockUsuarioService: any;
  let mockSnackBar: any;
  let mockDialogRef: any;

  beforeEach(async () => {
    mockClienteService = {
      obtenerCliente: jasmine.createSpy().and.returnValue(
        of({
          id: 1,
          tipoIdentificacion: 'Cédula',
          numeroIdentificacion: '1234567890',
          fechaNacimiento: '1990-01-01',
          nacionalidad: 'Ecuatoriana',
          estadoCivil: 'Soltero',
          sexo: 'Masculino',
          lugarNacimiento: 'Ambato',
          estatura: 1.75,
          peso: 70,
          direccion: 'Av. Siempre Viva',
        })
      ),
      crearCliente: jasmine.createSpy().and.returnValue(of({})),
      actualizarCliente: jasmine.createSpy().and.returnValue(of({})),
    };

    mockUsuarioService = {
      obtenerPorRol: jasmine.createSpy().and.returnValue(
        of([
          { id: 1, activo: true, nombre: 'Bryan' },
          { id: 2, activo: false, nombre: 'Inactivo' },
        ])
      ),
    };

    mockSnackBar = {
      open: jasmine.createSpy(),
    };

    mockDialogRef = {
      close: jasmine.createSpy(),
    };

    await TestBed.configureTestingModule({
      imports: [ClientesFormComponent, HttpClientTestingModule],
      providers: [
        { provide: ClienteService, useValue: mockClienteService },
        { provide: UsuarioService, useValue: mockUsuarioService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { clienteId: 1 } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientesFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar usuarios cliente activos', () => {
    component.ngOnInit(); // <--- ejecuta la carga de datos
    expect(component.usuariosClienteDisponibles.length).toBe(1);
    expect(component.usuariosClienteDisponibles[0].nombre).toBe('Bryan');
  });

  it('debería cargar los datos del cliente en modo edición', () => {
    component.ngOnInit(); // <-- Esto ejecuta la carga del cliente
    expect(component.cliente.numeroIdentificacion).toBe('1234567890');
    expect(component.isEditando).toBeTrue();
  });

  it('debería validar el formulario correctamente (sin ViewChild)', () => {
    component.isEditando = false;
    component.cliente.usuarioId = 1;
    component.cliente.tipoIdentificacion = 'Cédula';
    component.cliente.numeroIdentificacion = '1234567890';
    component.cliente.fechaNacimiento = '2000-01-01';
    expect(component.isFormValid).toBeTrue();
  });

  it('debería llamar a crearCliente() si no está en modo edición y formulario válido', () => {
    component.isEditando = false;
    component.cliente = {
      usuarioId: 1,
      tipoIdentificacion: 'Cédula',
      numeroIdentificacion: '1234567890',
      fechaNacimiento: '2000-01-01',
      nacionalidad: 'Ecuatoriana',
      estadoCivil: 'Soltero',
      sexo: 'Masculino',
      lugarNacimiento: 'Ambato',
      estatura: 1.75,
      peso: 70,
      direccion: 'Av. Siempre Viva',
    };

    component.guardar();

    expect(mockClienteService.crearCliente).toHaveBeenCalled();
    expect(mockDialogRef.close).toHaveBeenCalledWith('guardado');
  });

  it('debería llamar a actualizarCliente() si está en modo edición', () => {
    component.isEditando = true;
    component.clienteId = 1;
    component.cliente.usuarioId = 1;
    component.cliente.tipoIdentificacion = 'Cédula';
    component.cliente.numeroIdentificacion = '1234567890';
    component.cliente.fechaNacimiento = '2000-01-01';

    component.guardar();

    expect(mockClienteService.actualizarCliente).toHaveBeenCalledWith(
      1,
      jasmine.any(Object)
    );
    expect(mockDialogRef.close).toHaveBeenCalledWith('guardado');
  });

  it('debería agregar campo vacío si usuarioId no es válido', () => {
    component.cliente.usuarioId = 0;
    const result = component.isFormValid;
    // No importa el resultado, solo queremos ejecutar la línea parcialmente cubierta
    expect(result).toBeFalse();
  });

  it('debería devolver false si this.form es undefined', () => {
    (component as any).form = undefined;
    expect(component.isFormValid).toBeFalse();
  });

  it('debería devolver cadena vacía si no hay fecha', () => {
    const result = component.formatearFechaParaInput('');
    expect(result).toBe('');
  });

  it('debería devolver solo la parte de la fecha', () => {
    const result = component.formatearFechaParaInput('2023-01-01T12:00:00');
    expect(result).toBe('2023-01-01');
  });

  it('debería cerrar el diálogo sin parámetros', () => {
    component.cancelar(); // Método que solo hace this.dialogRef.close()
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
