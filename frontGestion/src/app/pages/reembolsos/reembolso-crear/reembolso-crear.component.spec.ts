import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReembolsoCrearComponent } from './reembolso-crear.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { ReembolsoService } from '../../../core/services/reembolso.service';
import { ContratoService } from '../../../core/services/contrato.service';
import { AuthService } from '../../../services/auth.service';

describe('ReembolsoCrearComponent', () => {
  let component: ReembolsoCrearComponent;
  let fixture: ComponentFixture<ReembolsoCrearComponent>;

  beforeEach(async () => {
    const mockReembolsoService = {
      crearReembolsoConArchivos: jasmine.createSpy().and.returnValue(of({})),
    };

    const mockContratoService = {
      obtenerPorCliente: jasmine.createSpy().and.returnValue(of([])),
    };

    const mockAuthService = {
      getUsuarioId: jasmine.createSpy().and.returnValue(1),
      getUsuarioPerfil: jasmine.createSpy().and.returnValue({ id: 1 }),
    };

    const mockSnackBar = {
      open: jasmine.createSpy(),
    };

    await TestBed.configureTestingModule({
      imports: [ReembolsoCrearComponent, HttpClientTestingModule],
      providers: [
        { provide: ReembolsoService, useValue: mockReembolsoService },
        { provide: ContratoService, useValue: mockContratoService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReembolsoCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
