import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReembolsoHistorialComponent } from './reembolso-historial.component';
import { AuthService } from '../../../services/auth.service';

describe('ReembolsoHistorialComponent', () => {
  let component: ReembolsoHistorialComponent;
  let fixture: ComponentFixture<ReembolsoHistorialComponent>;

  const mockAuthService = {
    getUsuarioId: () => 123, // Retorna un ID fijo de usuario
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReembolsoHistorialComponent, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService }, // 👈 inyección del mock
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReembolsoHistorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
