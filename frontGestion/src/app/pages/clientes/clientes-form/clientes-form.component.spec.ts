import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientesFormComponent } from './clientes-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClienteService } from '../../../core/services/cliente.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { of} from 'rxjs';

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
    expect(component.usuariosClienteDisponibles.length).toBe(1);
    expect(component.usuariosClienteDisponibles[0].nombre).toBe('Bryan');
  });

  it('debería cargar los datos del cliente en modo edición', () => {
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
});