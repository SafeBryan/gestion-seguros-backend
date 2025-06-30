import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ClientesListComponent } from './clientes-list.component';
import { ClienteService } from '../../../core/services/cliente.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { ClienteResponseDTO } from '../../../models/cliente-response.dto';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableDataSource } from '@angular/material/table';

describe('ClientesListComponent', () => {
  let component: ClientesListComponent;
  let fixture: ComponentFixture<ClientesListComponent>;
  let clienteServiceSpy: jasmine.SpyObj<ClienteService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  const mockClientes: ClienteResponseDTO[] = [
    {
      id: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@mail.com',
      telefono: '0999999999',
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
    },
  ];

  beforeEach(async () => {
    clienteServiceSpy = jasmine.createSpyObj('ClienteService', [
      'listarClientes',
      'desactivarCliente',
    ]);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    // 🟢 Default para evitar errores si se llama ngOnInit
    clienteServiceSpy.listarClientes.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [ClientesListComponent, NoopAnimationsModule],
      providers: [
        { provide: ClienteService, useValue: clienteServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientesListComponent);
    component = fixture.componentInstance;

    // ✅ Esto asegura que ngOnInit() se ejecute y se cubran más líneas
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar clientes correctamente', fakeAsync(() => {
    clienteServiceSpy.listarClientes.and.returnValue(of(mockClientes));
    component.cargarClientes();
    tick();
    expect(component.clientes.length).toBe(1);
    expect(component.loading).toBeFalse();
  }));

  it('debe aplicar el filtro correctamente', () => {
    component.dataSource.data = mockClientes;
    const inputEvent = { target: { value: 'juan' } } as unknown as Event;
    component.applyFilter(inputEvent);
    expect(component.dataSource.filter).toBe('juan');
  });

  it('debe calcular la edad correctamente', () => {
    const edad = component.calcularEdad('2000-06-24');
    const esperado =
      new Date().getFullYear() -
      2000 -
      (new Date().getMonth() < 5 ||
      (new Date().getMonth() === 5 && new Date().getDate() < 24)
        ? 1
        : 0);
    expect(edad).toBe(esperado);
  });

  it('debe devolver la clase de estado civil correcta', () => {
    expect(component.getEstadoCivilClass('Soltero')).toBe('estado-soltero');
    expect(component.getEstadoCivilClass('')).toBe('estado-default');
  });

  it('debe devolver la clase de sexo correcta', () => {
    expect(component.getSexoClass('Masculino')).toBe('sexo-masculino');
    expect(component.getSexoClass('')).toBe('sexo-default');
  });

  it('debe formatear fechas correctamente', () => {
    const formatted = component.formatearFecha('2022-05-01');
    expect(formatted).toContain('2022');
  });

  it('debe retornar el id del cliente en trackByClienteId', () => {
    const cliente = { ...mockClientes[0], id: 42 };
    expect(component.trackByClienteId(0, cliente)).toBe(42);
  });
  it('no debe hacer nada si se cancela la confirmación de desactivación', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.desactivarCliente(mockClientes[0]);
    expect(clienteServiceSpy.desactivarCliente).not.toHaveBeenCalled();
  });
  it('debe devolver otras clases de estado civil', () => {
    expect(component.getEstadoCivilClass('Casado')).toBe('estado-casado');
    expect(component.getEstadoCivilClass('Divorciado')).toBe(
      'estado-divorciado'
    );
    expect(component.getEstadoCivilClass('Viudo')).toBe('estado-viudo');
  });

  it('debe devolver clase para sexo femenino y default', () => {
    expect(component.getSexoClass('Femenino')).toBe('sexo-femenino');
    expect(component.getSexoClass('Otro')).toBe('sexo-default');
  });
});
